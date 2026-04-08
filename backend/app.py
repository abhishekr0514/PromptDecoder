from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json

try:
    from sentence_transformers import SentenceTransformer, util
except ImportError:
    raise ImportError("Install: pip install sentence-transformers")

from questions.data import questions
from openai import OpenAI

app = Flask(__name__)
CORS(app)

# 🔥 Ollama (OpenAI-compatible)
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

# 🔹 Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# 🔹 Track attempts per question
# attempt_tracker = {q["id"]: 0 for q in questions}

# 🔒 Track user progress (per IP for now)
user_progress = {}

# ==============================
# 🔹 Semantic Similarity Function
# ==============================
def check_prompt(original, user):
    emb1 = model.encode(original, convert_to_tensor=True)
    emb2 = model.encode(user, convert_to_tensor=True)

    score = util.cos_sim(emb1, emb2).item()
    return (score + 1) / 2  # Normalize


# ==============================
# 🔹 Keyword Matching
# ==============================
def keyword_score(keywords, user_prompt):
    user_words = set(user_prompt.lower().split())
    keyword_words = set(kw.lower() for kw in keywords)

    matches = len(user_words & keyword_words)
    return matches / len(keyword_words) if keyword_words else 0


# ==============================
# 🔹 Structure Matching
# ==============================
STOPWORDS = {"a", "the", "is", "in", "on", "of", "and", "to", "how"}

def structure_score(original, user):
    original_words = set(w for w in original.lower().split() if w not in STOPWORDS)
    user_words = set(w for w in user.lower().split() if w not in STOPWORDS)

    if not original_words:
        return 0

    overlap = len(original_words & user_words)
    return overlap / len(original_words)

# ==============================
# 🔹 AI Hint (Ollama)
# ==============================
def generate_hint(original, user, attempts):
    difficulty_levels = ["very vague", "moderate", "clear"]
    level = min(attempts, 2)

    try:
        response = client.chat.completions.create(
            model="qwen2.5:1.5b",  # ✅ CHANGED HERE
            temperature=0.7,
            messages=[
                {
                    "role": "system",
                    "content": f"""
You are a hint generator for a game.

Rules:
- DO NOT reveal the exact answer
- Give only a {difficulty_levels[level]} hint
- Help the user recover the hidden prompt

Hidden prompt: {original}
"""
                },
                {
                    "role": "user",
                    "content": f"My guess: {user}"
                }
            ]
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("Hint Error:", e)
        return "Try refining the intent and structure of your prompt."


# ==============================
# 🔹 GET QUESTIONS API (UPDATED)
# ==============================
@app.route("/api/questions", methods=["GET"])
def get_questions():
    round_param = request.args.get("round", "1")

    if round_param == "1":
        filtered_questions = [q for q in questions if q["id"] <= 9]

    elif round_param == "2":
        key = request.args.get("key")

        # 🔒 simple secret key check
        if key != "ROUND2_UNLOCK":
            return jsonify({
                "status": "locked",
                "message": "Complete Round 1 to unlock"
            }), 403

        filtered_questions = [q for q in questions if q["id"] > 9]

    else:
        filtered_questions = []

    return jsonify({
        "status": "success",
        "data": [
            {
                "id": q["id"],
                "difficulty": q["difficulty"],
                "expected_output": q["expected_output"],
                "score": q["score"]
            }
            for q in filtered_questions
        ]
    })


# ==============================
# 🔹 SUBMIT ANSWERS API (UPDATED)
# ==============================
@app.route("/api/submit", methods=["POST"])
def submit():

    user_id = request.headers.get("X-User-Id", "default_user")  # simple user tracking

    # Initialize user progress
    if user_id not in user_progress:
        user_progress[user_id] = 1

    current_allowed_q = user_progress[user_id]

    results = []
    total_score = 0

    data = request.json or {}

    # 🔥 Loop only over submitted keys (q1, q2, etc.)
    for key, user_prompt in data.items():

        # Extract question id (q1 → 1)
        try:
            qid = int(key.replace("q", ""))
        except:
            continue

        # 🚨 BLOCK if not the current allowed question
        # 🚨 BLOCK only if skipping ahead
        if qid > current_allowed_q:
            results.append({
                "question_id": qid,
                "status": "blocked",
                "message": f"Complete Question {current_allowed_q} first"
            })
            continue

        user_prompt = user_prompt.strip()

        # 🚨 Skip empty input
        if not user_prompt:
            results.append({
            "question_id": qid,
            "status": "empty",
            "message": "Prompt cannot be empty"
            })
            continue

        # Find the question
        q = next((q for q in questions if q["id"] == qid), None)
        if not q:
            continue

        # 🔹 Semantic score
        # 🔹 Hybrid scoring
        semantic = check_prompt(q["original_prompt"], user_prompt)
        keyword = keyword_score(q["keywords"], user_prompt)
        structure = structure_score(q["original_prompt"], user_prompt)

        final_semantic = (
            0.75 * semantic +
            0.10 * keyword +
            0.15 * structure
        )

        semantic_points = round(final_semantic * 100, 2)
        difficulty_points = q["score"]
        final_score = semantic_points + difficulty_points

        if final_semantic >= q["threshold"]:
            status = "correct"
            message = "Prompt accepted"
            output = q["expected_output"]
            feedback = None
            total_score += final_score
            # 🔓 Unlock next question
            # 🔓 Unlock next question safely
            if qid == current_allowed_q:
                user_progress[user_id] = current_allowed_q + 1
        else:
            status = "wrong"
            message = "Try again"
            output = None
            feedback = generate_hint(
            q["original_prompt"],
            user_prompt,
            0
        )

        results.append({
            "question_id": qid,
            "difficulty": q["difficulty"],
            "user_prompt": user_prompt,
            "score": {
                "semantic": round(semantic, 2),
                "keyword": round(keyword, 2),
                "structure": round(structure, 2),
                "final_semantic": round(final_semantic, 2),

                # 🔥 IMPORTANT (for frontend compatibility)
                "semantic_score": round(final_semantic, 2),
                "semantic_points": semantic_points,
                "difficulty_points": difficulty_points,
                "final_score": round(final_score, 2),

                # keep old naming too (optional)
                "final": round(final_score, 2)
            },
            "status": status,
            "message": message,
            "output": output,
            "feedback": feedback
        })

    return jsonify({
        "status": "success",
        "total_score": round(total_score, 2),
        "results": results
    })


# ==============================
# 🔹 DOWNLOAD RESULTS AS JSON
# ==============================
@app.route("/api/download-results", methods=["POST"])
def download_results():
    response = submit().get_json()

    json_data = json.dumps(response, indent=4)

    return Response(
        json_data,
        mimetype="application/json",
        headers={
            "Content-Disposition": "attachment;filename=results.json"
        }
    )



# ==============================
# 🔹 HEALTH CHECK
# ==============================
@app.route("/")
def home():
    return jsonify({
        "status": "running",
        "message": "PromptDecoder API is running 🚀"
    })


# ==============================
# 🔹 RUN SERVER
# ==============================
if __name__ == "__main__":
    app.run(debug=True)
    CORS(app)