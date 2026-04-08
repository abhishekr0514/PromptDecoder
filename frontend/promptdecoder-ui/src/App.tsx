import { useState, useEffect } from "react";
import "./styles.css";
import { fetchQuestions, submitPrompt } from "./api";
import { ParticleBackground, GlitchText } from "./components/atoms";
import { QuestionCard } from "./components/QuestionCard";
import { IntroScreen } from "./components/IntroScreen";
import { DoneScreen } from "./components/DoneScreen";
import type { Question, QuestionResult, Phase } from "./types";
import { usePersistentState } from "./hooks/usePersistentState";

export default function App() {
  const [userId] = useState(() => {
    let id = localStorage.getItem("user_id");
    if (!id) {
      id = "user_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("user_id", id);
    }
    return id;
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<Record<number, QuestionResult>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [phase, setPhase] = usePersistentState<Phase>("phase", "intro");
  const [playerName, setPlayerName] = usePersistentState("player_name", "");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setPhase("intro");
  }, []);

  // Load questions when game starts
  useEffect(() => {
    if (phase !== "game") return;
    fetchQuestions(1)
      .then(setQuestions)
      .catch(() => setError("Cannot reach backend. Is Flask running on port 5000?"));
  }, [phase]);

  // Auto-advance to done screen when all solved
  const solved = Object.values(results).filter(r => r.status === "correct").length;
  const round1Completed = questions.length === 9 && solved === 9;
  const [round2Unlocked, setRound2Unlocked] = useState(false);
  useEffect(() => {
    if (round1Completed && !round2Unlocked) {
      setRound2Unlocked(true);

      // 🔓 fetch round 2
      fetchQuestions(2, "ROUND2_UNLOCK")
        .then((newQs) => {
          setQuestions(prev => [...prev, ...newQs]); // append
        })
        .catch(() => setError("Failed to load Round 2"));
    }
  }, [round1Completed, round2Unlocked]);

  const TOTAL_QUESTIONS = 12;

  useEffect(() => {
    if (questions.length > 0 && solved === TOTAL_QUESTIONS && phase === "game") {
      setTimeout(() => setPhase("done"), 800);
    }
  }, [solved, questions.length, phase]);

  const handleSubmit = async (qid: number, prompt: string) => {
    setLoadingId(qid);
    try {
      const result = await submitPrompt(qid, prompt, userId);
      const prev = results[qid];
      const updatedResult: QuestionResult = {
        ...result,
        attempts: (prev?.attempts ?? 0) + 1,
      };
      setResults(prev => ({ ...prev, [qid]: updatedResult }));
      if (result.status === "correct") {
        setTotalScore(prev => prev + result.final_score);
      }
    } catch {
      setError("Submission failed. Check your backend.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReplay = () => {
    setResults({});
    setTotalScore(0);
    setPhase("intro");
    setPlayerName("");
    setQuestions([]);
    setError(null);
  };

  return (
    <>
      <ParticleBackground />
      <div className="app-wrapper">

        {/* ── Header (game + done only) ── */}
        {phase !== "intro" && (
          <header className="site-header">
            <div className="logo">
              <GlitchText text="PROMPT" />
              <span>DECODER</span>
            </div>
            <div className="header-stats">
              <div className="stat-pill">
                <span className="stat-val" style={{ color: "#ffb800" }}>{Math.round(totalScore)}</span>
                <span className="stat-key">SCORE</span>
              </div>
              <div className="stat-pill">
                <span className="stat-val">{solved}/{questions.length}</span>
                <span className="stat-key">SOLVED</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div className="progress-bar-header">
                  <div className="progress-bar-fill"
                    style={{ width: questions.length ? `${(solved / questions.length) * 100}%` : "0%" }} />
                </div>
                <span className="stat-key" style={{ textAlign: "right" }}>PROGRESS</span>
              </div>
            </div>
          </header>
        )}

        {/* ── Screens ── */}
        {phase === "intro" && (
          <IntroScreen
            playerName={playerName}
            setPlayerName={setPlayerName}
            onStart={() => setPhase("game")}
          />
        )}

        {phase === "game" && (
          <div className="game-layout">
            <div className="game-hero">
              <div className="game-title">
                <span className="accent"><GlitchText text="DECODE" /></span> THE PROMPTS
              </div>
              <div className="player-tag">SESSION: <span>{playerName.toUpperCase()}</span></div>
            </div>

            {error && (
              <div style={{
                background: "rgba(255,79,110,0.1)", border: "1px solid rgba(255,79,110,0.3)",
                borderRadius: 8, padding: "1rem", marginBottom: "1.5rem",
                fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#ff4f6e"
              }}>
                ⚠ {error}
              </div>
            )}

            {!questions.length && !error && (
              <div style={{
                textAlign: "center", padding: "3rem", fontFamily: "var(--font-mono)",
                color: "var(--muted)", letterSpacing: "0.1em"
              }}>
                LOADING QUESTIONS...
              </div>
            )}
            {/* 🔒 Round 2 Locked Message */}
            {!round2Unlocked && (
              <div style={{
                textAlign: "center",
                padding: "2rem",
                opacity: 0.6,
                fontFamily: "var(--font-mono)"
              }}>
                🔒 ROUND 2 LOCKED
                <br />
                <small>Complete all Round 1 questions to unlock</small>
              </div>
            )}
            <div className="cards-stack">
              {questions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  q={q}
                  index={i}
                  onSubmit={handleSubmit}
                  result={results[q.id] ?? null}
                  loading={loadingId === q.id}
                />
              ))}
            </div>
          </div>
        )}

        {phase === "done" && (
          <DoneScreen
            playerName={playerName}
            totalScore={totalScore}
            results={results}
            totalQuestions={questions.length}
            onReplay={handleReplay}
          />
        )}

      </div>
    </>
  );
}