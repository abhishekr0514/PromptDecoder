export interface Question {
  id: number;
  difficulty: string;
  expected_output: string;
  score: number;
  threshold?: number;
  hint?: string;
}

export interface QuestionResult {
  status: "correct" | "wrong";
  message: string;

  semantic_score: number;
  semantic_points: number;
  difficulty_points: number;
  final_score: number;

  // 🔥 ADD THESE
  keyword_score?: number;
  structure_score?: number;

  level: string;
  attempts: number;
  feedback: string | null;
  output: string | null;
  original_prompt: string | null;
}

export type Phase = "intro" | "game" | "done";