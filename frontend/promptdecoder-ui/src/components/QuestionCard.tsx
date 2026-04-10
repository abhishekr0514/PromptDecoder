import { DIFFICULTY_CONFIG, LEVEL_CONFIG } from "../constants";
import { ScoreRing, TypewriterText } from "./atoms";
import type { Question, QuestionResult } from "../types";

interface Props {
  q: Question;
  index: number;
  prompt: string;
  onPromptChange: (qid: number, prompt: string) => void;
  onSubmit: (qid: number, prompt: string) => void;
  result: QuestionResult | null;
  loading: boolean;
}

export function QuestionCard({ q, index, prompt, onPromptChange, onSubmit, result, loading }: Props) {
  const diff = DIFFICULTY_CONFIG[q.difficulty] ?? DIFFICULTY_CONFIG["easy"];
  const isCorrect = result?.status === "correct";

  return (
    <div
      className={`question-card ${result ? (isCorrect ? "card-correct" : "card-wrong") : ""}`}
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      {/* Header */}
      <div className="card-header">
        <div className="card-meta">
          <span className="q-number">Q{q.id}</span>
          <span className="difficulty-badge"
            style={{ color: diff.color, borderColor: diff.color, boxShadow: `0 0 8px ${diff.glow}` }}>
            {diff.icon} {q.difficulty}
          </span>
          <span className="score-badge">+{q.score} pts</span>
        </div>
        {result && (
          <div className="result-badge" style={{ color: isCorrect ? "#00ff9d" : "#ff4f6e" }}>
            {result.message}
          </div>
        )}
      </div>

      {/* Expected output */}
      <div className="expected-output">
        <div className="output-label">
          <span className="label-dot" />
          EXPECTED OUTPUT
        </div>
        <div className="output-text">
          {q.expected_output.includes("class") || q.expected_output.includes("import") ? (
            <pre className="code-block">
              <code>{q.expected_output}</code>
            </pre>
          ) : (
            <span style={{ whiteSpace: "pre-line", fontWeight: "bold" }}>
              {q.expected_output}
            </span>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="input-section">
        <label className="input-label">
          <span style={{ color: "#00ff9d" }}>{">"}</span> YOUR PROMPT
        </label>
        <textarea
          className="prompt-input"
          placeholder="Decode the hidden prompt..."
          value={prompt}
          onChange={e => onPromptChange(q.id, e.target.value)}
          rows={3}
          disabled={isCorrect}
        />
      </div>

      {/* Result */}
      {result && (
        <div className="result-section">
          <div className="score-row">
            <ScoreRing score={result.semantic_score * 100} />
            <div className="score-details">
              <div className="score-item">
                <span className="score-label">Semantic Match: </span>
                <span className="score-value" style={{ color: "#00ff9d" }}>{result.semantic_points.toFixed(1)} pts</span>
              </div>
              <div className="score-item">
                <span className="score-label">Difficulty Bonus: </span>
                <span className="score-value" style={{ color: "#ffb800" }}>+{result.difficulty_points} pts</span>
              </div>
              <div className="score-item total">
                <span className="score-label">Total: </span>
                <span className="score-value" style={{ color: "#fff" }}>{result.final_score.toFixed(1)} pts</span>
              </div>
              <div className="level-bar-wrapper">
                <div className="level-label">{result.level}</div>
                <div className="level-bar-bg">
                  <div className="level-bar-fill" style={{
                    width: LEVEL_CONFIG[result.level]?.width ?? "20%",
                    background: LEVEL_CONFIG[result.level]?.color ?? "#ff4f6e",
                    boxShadow: `0 0 10px ${LEVEL_CONFIG[result.level]?.color ?? "#ff4f6e"}`,
                  }} />
                </div>
              </div>
            </div>
          </div>

          {result.feedback && (
            <div className="hint-box">
              <span className="hint-icon">💡</span>
              <TypewriterText text={result.feedback} />
            </div>
          )}

          {!isCorrect && (
            <div style={{
              marginTop: "0.5rem",
              fontSize: "0.8rem",
              fontFamily: "var(--font-mono)",
              color: "#ff4f6e",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}>
              {result?.keyword_score !== undefined && result.keyword_score < 0.5 && (
                <div>⚠ Missing key terms</div>
              )}
              {result?.structure_score !== undefined && result.structure_score < 0.5 && (
                <div>⚠ Prompt structure is off</div>
              )}
              {((result?.keyword_score !== undefined && result.keyword_score < 0.5) ||
                (result?.structure_score !== undefined && result.structure_score < 0.5)) && (
                  <div style={{ marginTop: "4px", color: "rgba(255, 79, 110, 0.8)", fontSize: "0.75rem", fontStyle: "italic" }}>
                    The response may lack semantic depth—consider refining the vocabulary.
                  </div>
                )}
            </div>
          )}

          {isCorrect && result.output && (
            <div className="success-output">
              <div className="output-label">
                <span className="label-dot" style={{ background: "#00ff9d" }} />
                OUTPUT VERIFIED ✔
              </div>
              <div className="unlocked-text">
                <TypewriterText text={result.output} speed={25} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="card-footer">
        {result && (
          <div className="attempt-info">Attempt #{result.attempts}</div>
        )}
        <button
          className={`submit-btn ${isCorrect ? "btn-disabled" : ""}`}
          onClick={() => { if (!isCorrect && prompt.trim()) onSubmit(q.id, prompt); }}
          disabled={isCorrect || loading || !prompt.trim()}
        >
          {loading ? (
            <span className="btn-loading"><span /><span /><span /></span>
          ) : isCorrect ? "✓ DECODED" : "DECODE →"}
        </button>
      </div>
    </div>
  );
}
