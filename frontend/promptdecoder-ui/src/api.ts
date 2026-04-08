import { API_BASE } from "./constants";
import type { Question, QuestionResult } from "./types";

export async function fetchQuestions(round: number = 1, key?: string): Promise<Question[]> {
    let url = `${API_BASE}/api/questions?round=${round}`;

    if (round === 2 && key) {
        url += `&key=${key}`;
    }

    const res = await fetch(url);

    // handle locked response (403)
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch questions");
    }

    const data = await res.json();
    return data.data ?? [];
}

export async function submitPrompt(
    questionId: number,
    userPrompt: string,
    userId: string
): Promise<QuestionResult> {
    const body: Record<string, string> = {};
    body[`q${questionId}`] = userPrompt;

    const res = await fetch(`${API_BASE}/api/submit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    const r = data.results?.[0];
    if (!r) throw new Error("Invalid response");

    return {
        status: r.status,
        message: r.message,

        // 🔹 Core scores
        semantic_score: r.score.semantic_score,
        semantic_points: r.score.semantic_points,
        difficulty_points: r.score.difficulty_points,
        final_score: r.score.final_score,

        // 🔥 ADD THESE HERE
        keyword_score: r.score.keyword,
        structure_score: r.score.structure,

        level: computeLevel(r.score.semantic_score),
        attempts: 1,
        feedback: r.feedback ?? null,
        output: r.output ?? null,
        original_prompt: null,
    };
}

function computeLevel(semantic: number): string {
    if (semantic > 0.85) return "Perfect 🎯";
    if (semantic > 0.70) return "Good 👍";
    if (semantic > 0.50) return "Close 👀";
    return "Far ❌";
}