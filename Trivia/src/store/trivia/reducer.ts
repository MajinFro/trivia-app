import clone from 'clone';
import {
  QuestionsState,
  TriviaAction,
  UserAnswerAction,
  UpdateTokenAction,
  ErrorAction,
  QuestionsReceivedAction,
  Question,
} from '../types';
import {TRIVIA_ACTION_TYPES, errorAction, updateToken} from './actions';
import {ITriviaResponse} from '../../services';

const entities = require('html-entities').AllHtmlEntities;

export const initialState: QuestionsState = {
  questions: [
    {
      category: '',
      answer: false,
      question: '',
    },
  ],
  currentQuestion: 0,
  isLoading: false,
  isFinished: false,
  gameOver: false,
};

const Questions = (
  state: QuestionsState = initialState,
  action: TriviaAction,
) => {
  const newState: QuestionsState = clone<QuestionsState>(state);

  switch (action.type) {
    case TRIVIA_ACTION_TYPES.SHOW_LOADING:
      newState.isLoading = true;
      newState.isFinished = false;
      newState.errorMessage = undefined;
      return newState;
    case TRIVIA_ACTION_TYPES.QUESTIONS_RECEIVED:
      newState.isLoading = false;
      newState.gameOver = false;
      newState.isFinished = true;
      newState.currentQuestion = 0;
      return mapQuestions(
        newState,
        (action as QuestionsReceivedAction).triviaResponse,
      );
    case TRIVIA_ACTION_TYPES.MARK_UNFINISHED:
      newState.isFinished = false;
      return newState;
    case TRIVIA_ACTION_TYPES.UPDATE_TOKEN:
      newState.questionToken = (action as UpdateTokenAction).token;
      return newState;
    case TRIVIA_ACTION_TYPES.ERROR:
      newState.errorMessage = (action as ErrorAction).error;
      return newState;
    case TRIVIA_ACTION_TYPES.USER_ANSWER:
      let index: number = newState.currentQuestion;
      // eslint-disable-next-line prettier/prettier
      newState.questions[index].userAnswer = (action as UserAnswerAction).answer;
      if (index < newState.questions.length - 1) {
        newState.currentQuestion++;
      } else {
        newState.gameOver = true;
      }
      return newState;
    default:
      return state;
  }
};

function mapQuestions(
  state: QuestionsState,
  response: ITriviaResponse,
): QuestionsState {
  if (response.errorMessage) {
    return Questions(state, errorAction(response.errorMessage));
  }

  if (response.token !== state.questionToken) {
    state = Questions(state, updateToken(response.token));
  }

  state.questions = response.questions.map(
    (question) =>
      ({
        category: decodeHTMLEntities(question.category),
        answer: getBoolFromString(question.correct_answer),
        question: decodeHTMLEntities(question.question),
      } as Question),
  );
  return state;
}

function decodeHTMLEntities(str: string | null | undefined): string | null {
  if (str) {
    return entities.decode(str);
  }
  return null;
}

function getBoolFromString(str: string | null | undefined): boolean {
  if (str) {
    return str.toLowerCase() === 'true';
  }
  return false;
}

export default Questions;
