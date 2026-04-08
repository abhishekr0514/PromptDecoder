// export const API_BASE =
//   import.meta.env.VITE_API_BASE || " https://emissions-rendered-exceptional-chapter.trycloudflare.com";

export const API_BASE = "http://localhost:5000";
  
export const DIFFICULTY_CONFIG: Record<string, { color: string; glow: string; icon: string }> = {
  easy:     { color: "#00ff9d", glow: "rgba(0,255,157,0.4)",  icon: "◈" },
  medium:   { color: "#ffb800", glow: "rgba(255,184,0,0.4)",  icon: "◉" },
  hard:     { color: "#ff4f6e", glow: "rgba(255,79,110,0.4)", icon: "◆" },
  extreme:  { color: "#ff3cac", glow: "rgba(255,60,172,0.4)", icon: "◇" },
  ultimate: { color: "#784ba0", glow: "rgba(120,75,160,0.4)", icon: "★" },
};

export const LEVEL_CONFIG: Record<string, { color: string; width: string }> = {
  "Perfect 🎯": { color: "#00ff9d", width: "100%" },
  "Good 👍":    { color: "#ffb800", width: "75%"  },
  "Close 👀":   { color: "#ff7c3a", width: "50%"  },
  "Far ❌":     { color: "#ff4f6e", width: "20%"  },
};