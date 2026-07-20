export const API_URL = "https://opentdb.com/api.php?amount=15";

export interface Questions {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

export interface ResultType {
  response_code: number;
  results: Questions[];
}
