import {ITriviaResponse} from 'src/services';

export type Question = {
  category: string;
  answer: boolean;
  question: string;
  userAnswer?: boolean;
};

export type QuestionsState = {
  questions: Question[];
  currentQuestion: number;
  isLoading: boolean;
  isFinished: boolean;
  gameOver: boolean;
  errorMessage?: string;
  questionToken?: string;
};

export type AppState = {
  questions: QuestionsState;
};

export type QuestionsReceivedAction = {
  type: string;
  triviaResponse: ITriviaResponse;
};

export type RequestQuestionsAction = {
  type: string;
  token?: string;
};

export type UserAnswerAction = {
  type: string;
  answer: boolean;
};

export type UpdateTokenAction = {
  type: string;
  token?: string;
};

export type ErrorAction = {
  type: string;
  error: string;
};

export type ShowLoadingAction = {
  type: string;
  str: string;
};

export type MarkUnfinishedAction = {
  type: string;
  str: string;
};

export type TriviaAction =
  | QuestionsReceivedAction
  | RequestQuestionsAction
  | UserAnswerAction
  | UpdateTokenAction
  | ErrorAction
  | ShowLoadingAction
  | MarkUnfinishedAction;
