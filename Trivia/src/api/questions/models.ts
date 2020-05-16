export interface IQuestionRequest {
  amount: number;
  type?: string;
  token?: string;
  difficulty?: string;
  category?: number;
  encode?: string;
}

export interface IQuestionResponse {
  response_code: number;
  results: IQuestion[];
}

export interface IQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}
