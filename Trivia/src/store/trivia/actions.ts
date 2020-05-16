import {
  QuestionsReceivedAction,
  RequestQuestionsAction,
  UserAnswerAction,
  UpdateTokenAction,
  ErrorAction,
  ShowLoadingAction,
  MarkUnfinishedAction,
} from '../types';
import {ITriviaResponse} from 'src/services';

export enum TRIVIA_ACTION_TYPES {
  QUESTIONS_RECEIVED = 'TRIVIA/QUESTIONS_RECEIVED',
  REQUEST_QUESTIONS = 'TRIVIA/REQUEST_QUESTIONS',
  USER_ANSWER = 'TRIVIA/USER_ANSWER',
  UPDATE_TOKEN = 'TRIVIA/UPDATE_TOKEN',
  ERROR = 'TRIVIA/ERROR',
  SHOW_LOADING = 'TRIVIA/SHOW_LOADING',
  FINISHED_LOADING = 'TRIVIA/FINISHED_LOADING',
}

export const questionsReceived = (
  response: ITriviaResponse,
): QuestionsReceivedAction => ({
  type: TRIVIA_ACTION_TYPES.QUESTIONS_RECEIVED,
  triviaResponse: response,
});

export const requestQuestions = (token?: string): RequestQuestionsAction => ({
  type: TRIVIA_ACTION_TYPES.REQUEST_QUESTIONS,
  token: token,
});

export const userAnswer = (answer: boolean): UserAnswerAction => ({
  type: TRIVIA_ACTION_TYPES.USER_ANSWER,
  answer: answer,
});

export const updateToken = (token?: string): UpdateTokenAction => ({
  type: TRIVIA_ACTION_TYPES.UPDATE_TOKEN,
  token: token,
});

export const errorAction = (error: string): ErrorAction => ({
  type: TRIVIA_ACTION_TYPES.ERROR,
  error: error,
});

export const showLoading = (str: string): ShowLoadingAction => ({
  type: TRIVIA_ACTION_TYPES.SHOW_LOADING,
  str: str,
});

export const markUnfinished = (str: string): MarkUnfinishedAction => ({
  type: TRIVIA_ACTION_TYPES.FINISHED_LOADING,
  str: str,
});
