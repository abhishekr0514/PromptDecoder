interface Props {
  playerName: string;
  setPlayerName: (v: string) => void;
  onStart: () => void;
}

export function IntroScreen({ playerName, setPlayerName, onStart }: Props) {
  return (
    <div className="intro-screen">
      <div className="intro-card">
        <span className="intro-icon">🧩</span>
        <div className="intro-title">
          <span className="accent">PROMPT</span>DECODER
        </div>
        <div className="intro-sub">// REVERSE ENGINEER THE HIDDEN PROMPT</div>
        <p className="intro-desc">
          The system has been compromised. All you have are the <strong>outputs</strong> — the original prompts are lost.
          <br /><br />
          Your mission: <strong>reverse-engineer the hidden prompt</strong> behind each response.
          Think like the model. Predict its intent. Decode its logic.
          <br /><br />
          Every word matters. The closer your reconstruction, the higher your score — but be warned:
          ambiguity, misdirection, and edge cases stand in your way.
        </p>
        <div className="rules-grid">
          <div className="rule-item">
            <span className="rule-icon">{"🤖"}</span> Booting semantic matcher... [OK]
          </div>
          <div className="rule-item">
            <span className="rule-icon">{"⏳"}</span> Loading difficulty matrix... [OK]
          </div>
          <div className="rule-item">
            <span className="rule-icon">{"💡"}</span> Enabling hint system... [ACTIVE]
          </div>
          <div className="rule-item">
            <span className="rule-icon">{"🎯"}</span> Syncing AI scoring engine... [LIVE]
          </div>
        </div>
        <div style={{ height: "16px" }} />
        <input
          className="name-input"
          placeholder="Enter your hacker alias..."
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && playerName.trim() && onStart()}
        />
        <button className="start-btn" onClick={onStart} disabled={!playerName.trim()}>
          INITIALIZE SESSION →
        </button>
      </div>
    </div>
  );
}