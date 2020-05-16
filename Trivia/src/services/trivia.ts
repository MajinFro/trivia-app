import {
  getSessionToken,
  getTrivia,
  ITokenRequest,
  IQuestionRequest,
  IQuestionResponse,
  IQuestion,
} from '../api';

async function getToken(): Promise<string | undefined> {
  let request: ITokenRequest = {command: 'request'};
  const response = await getSessionToken(request);
  return response.token;
}

async function getQuestions(
  amount: number,
  token: string | undefined,
): Promise<IQuestionResponse> {
  let request: IQuestionRequest = {
    amount: amount,
    type: 'boolean',
    token: token,
  };

  return await getTrivia(request);
}

function getErrorMessage(responseCode: number): string {
  switch (responseCode) {
    case 1:
      return 'No results found.';
    case 2:
      return 'Invalid parameter.';
    case 3:
      return 'Token not found.';
    case 4:
      return 'Out of questions for the token.';
    case -1:
    default:
      return 'An error has occurred.';
  }
}

export interface ITriviaResponse {
  questions: IQuestion[];
  token?: string;
  errorMessage?: string;
}

export const getNextSetOfQuestions = async (
  amount: number,
  token?: string,
): Promise<ITriviaResponse> => {
  let retVal: ITriviaResponse = {questions: [], token: token};
  let retries: number = 0;

  while (retries < 3) {
    if (!retVal.token) {
      retVal.token = await getToken();
    }

    let questions: IQuestionResponse = await getQuestions(amount, token);
    if (questions.response_code === 0) {
      retVal.questions = questions.results;
      break;
    } else if (questions.response_code === 3 || questions.response_code === 4) {
      retVal.token = undefined;
      retries++;
    } else {
      retries++;
    }
    if (retries === 3 && questions.response_code !== 0) {
      retVal.errorMessage = getErrorMessage(questions.response_code);
    }
  }

  return retVal;
};
