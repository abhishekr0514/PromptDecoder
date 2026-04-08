import type { QuestionResult } from "../types";

interface Props {
  playerName: string;
  totalScore: number;
  results: Record<number, QuestionResult>;
  totalQuestions: number;
  onReplay: () => void;
}

export function DoneScreen({ playerName, totalScore, results, totalQuestions, onReplay }: Props) {
  const allResults = Object.values(results);
  const totalAttempts = allResults.reduce((a, r) => a + r.attempts, 0);
  const avgMatch = allResults.length
    ? Math.round((allResults.reduce((a, r) => a + r.semantic_score, 0) / allResults.length) * 100)
    : 0;

  return (
    <div className="done-screen">
      <div className="done-card">
        <span className="done-icon">🏆</span>
        <div className="done-title">MISSION COMPLETE</div>
        <div className="done-sub">// ALL PROMPTS DECODED — {playerName.toUpperCase()}</div>
        <div className="final-score-display">{Math.round(totalScore)}</div>
        <div className="final-score-label">TOTAL SCORE</div>
        <div className="done-stats">
          <div className="done-stat">
            <div className="val">{totalQuestions}</div>
            <div className="key">DECODED</div>
          </div>
          <div className="done-stat">
            <div className="val">{totalAttempts}</div>
            <div className="key">ATTEMPTS</div>
          </div>
          <div className="done-stat">
            <div className="val">{avgMatch}%</div>
            <div className="key">AVG MATCH</div>
          </div>
        </div>
        <button className="replay-btn" onClick={onReplay}>↺ NEW SESSION</button>
      </div>
    </div>
  );
}