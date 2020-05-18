import {getNextSetOfQuestions, ITriviaResponse} from '../trivia';
import {IQuestionResponse, IQuestion, ITokenResponse} from '../../api';

jest.mock('../../api', () => {
  const actualAPI = jest.requireActual('../../api');
  const getSessionTokenOriginalImplementation = actualAPI.getSessionToken;
  const getQuestionsOriginalImplementation = actualAPI.getQuestions;
  return {
    ...actualAPI,
    getQuestions: jest
      .fn()
      .mockImplementation(getQuestionsOriginalImplementation),
    getSessionToken: jest
      .fn()
      .mockImplementation(getSessionTokenOriginalImplementation),
  };
});

import * as api from '../../api';

let getQuestions: jest.SpyInstance;
let getSessionToken: jest.SpyInstance;

beforeEach(() => {
  getQuestions = jest.spyOn(api, 'getQuestions');
  getSessionToken = jest.spyOn(api, 'getSessionToken');
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockQuestions: IQuestion[] = [
  {
    category: 'Entertainment',
    type: 'boolean',
    difficulty: 'easy',
    question: 'why?',
    correct_answer: 'True',
    incorrect_answers: ['False'],
  },
  {
    category: 'Entertainment',
    type: 'boolean',
    difficulty: 'hard',
    question: 'what?',
    correct_answer: 'False',
    incorrect_answers: ['True'],
  },
];

const tokenResponse: ITokenResponse = {
  response_code: 0,
  token: 'A_NEW_SESSION_TOKEN',
};

describe('successful response from getNextSetOfQuestions', () => {
  const mockData: IQuestionResponse = {
    response_code: 0,
    results: mockQuestions,
  };

  describe('when passed a token', () => {
    it('should return data from response', async () => {
      getQuestions.mockReturnValueOnce(Promise.resolve(mockData));
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));

      const trivia = await getNextSetOfQuestions(10, 'A_SESSION_TOKEN');

      let expectedResponse: ITriviaResponse = {
        questions: mockQuestions,
        token: 'A_SESSION_TOKEN',
      };
      expect(trivia).toEqual(expectedResponse);

      expect(getQuestions).toHaveBeenCalledTimes(1);
      expect(getQuestions).toHaveBeenCalledWith({
        amount: 10,
        type: 'boolean',
        token: 'A_SESSION_TOKEN',
      });

      expect(getSessionToken).toHaveBeenCalledTimes(0);
    });
  });

  describe('when not passed a token', () => {
    it('should request a token and return data from the response', async () => {
      getQuestions.mockReturnValueOnce(Promise.resolve(mockData));
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));

      const trivia = await getNextSetOfQuestions(10);

      let expectedResponse: ITriviaResponse = {
        questions: mockQuestions,
        token: 'A_NEW_SESSION_TOKEN',
      };

      expect(trivia).toEqual(expectedResponse);

      expect(getQuestions).toHaveBeenCalledTimes(1);
      expect(getQuestions).toHaveBeenCalledWith({
        amount: 10,
        type: 'boolean',
        token: 'A_NEW_SESSION_TOKEN',
      });

      expect(getSessionToken).toHaveBeenCalledTimes(1);
      expect(getSessionToken).toHaveBeenCalledWith({
        command: 'request',
      });
    });
  });
});

describe('error response from trivia api', () => {
  describe('token has expired', () => {
    const mockDataTokenError = {
      response_code: 3,
      results: [],
    } as IQuestionResponse;

    it('should request a token and return data from the second response', async () => {
      const mockDataSuccessful = {
        response_code: 0,
        results: mockQuestions,
      } as IQuestionResponse;

      getQuestions
        .mockReturnValueOnce(Promise.resolve(mockDataTokenError))
        .mockReturnValueOnce(Promise.resolve(mockDataSuccessful));

      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));
      const trivia = await getNextSetOfQuestions(10, 'A_SESSION_TOKEN');

      let expectedResponse: ITriviaResponse = {
        token: 'A_NEW_SESSION_TOKEN',
        questions: mockQuestions,
      };

      expect(trivia).toEqual(expectedResponse);

      expect(getQuestions).toHaveBeenCalledTimes(2);
      expect(getQuestions).toHaveBeenCalledWith({
        amount: 10,
        type: 'boolean',
        token: 'A_SESSION_TOKEN',
      });
      expect(getQuestions).toHaveBeenCalledWith({
        amount: 10,
        type: 'boolean',
        token: 'A_NEW_SESSION_TOKEN',
      });

      expect(getSessionToken).toHaveBeenCalledTimes(1);
      expect(getSessionToken).toHaveBeenCalledWith({
        command: 'request',
      });
    });

    describe('has 3 retries that all result in invalid token', () => {
      const tokenResponse2 = {
        response_code: 0,
        token: 'A_NEW_SESSION_TOKEN_2',
      } as ITokenResponse;
      beforeEach(() => {
        getQuestions.mockReturnValue(Promise.resolve(mockDataTokenError));

        getSessionToken
          .mockReturnValueOnce(Promise.resolve(tokenResponse))
          .mockReturnValueOnce(Promise.resolve(tokenResponse2));
      });

      it('should return a trivia response with an empty array and error message', async () => {
        const trivia = await getNextSetOfQuestions(10, 'A_SESSION_TOKEN');
        let expectedResponse: ITriviaResponse = {
          errorMessage: 'Token not found.',
          questions: [],
        };
        expect(trivia).toEqual(expectedResponse);
      });

      it('should attempt to get token twice', async () => {
        await getNextSetOfQuestions(10, 'A_SESSION_TOKEN');
        expect(getSessionToken).toHaveBeenCalledTimes(2);
        expect(getSessionToken).toHaveBeenCalledWith({
          command: 'request',
        });
      });

      it('should attempt to get data 3 times', async () => {
        await getNextSetOfQuestions(10, 'A_SESSION_TOKEN');

        expect(getQuestions).toHaveBeenCalledTimes(3);
        expect(getQuestions).toHaveBeenCalledWith({
          amount: 10,
          type: 'boolean',
          token: 'A_SESSION_TOKEN',
        });
        expect(getQuestions).toHaveBeenCalledWith({
          amount: 10,
          type: 'boolean',
          token: 'A_NEW_SESSION_TOKEN',
        });
        expect(getQuestions).toHaveBeenCalledWith({
          amount: 10,
          type: 'boolean',
          token: 'A_NEW_SESSION_TOKEN_2',
        });
      });
    });
  });

  describe('has 3 retries that all result in No Results Found', () => {
    it('should return a trivia response with an empty array and error message', async () => {
      const mockDataNoResults = {
        response_code: 1,
        results: [],
      } as IQuestionResponse;

      getQuestions.mockReturnValue(Promise.resolve(mockDataNoResults));
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));
      const trivia = await getNextSetOfQuestions(10, 'A_SESSION_TOKEN');
      let expectedResponse: ITriviaResponse = {
        errorMessage: 'No results found.',
        questions: [],
      };

      expect(trivia).toEqual(expectedResponse);
    });
  });

  describe('has 3 retries that all result in Invalid Parameter', () => {
    it('should return a trivia response with an empty array and error message', async () => {
      const mockDataInvalidParameter = {
        response_code: 2,
        results: [],
      } as IQuestionResponse;

      getQuestions.mockReturnValue(Promise.resolve(mockDataInvalidParameter));
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));
      const trivia = await getNextSetOfQuestions(10, 'A_SESSION_TOKEN');
      let expectedResponse: ITriviaResponse = {
        errorMessage: 'Invalid parameter.',
        questions: [],
      };

      expect(trivia).toEqual(expectedResponse);
    });
  });

  describe('has 3 retries that all result in Out Of Questions', () => {
    it('should return a trivia response with an empty array and error message', async () => {
      const mockDataTokenOutOfQuestions = {
        response_code: 4,
        results: [],
      } as IQuestionResponse;

      getQuestions.mockReturnValue(
        Promise.resolve(mockDataTokenOutOfQuestions),
      );
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));
      const trivia = await getNextSetOfQuestions(10, 'A_SESSION_TOKEN');
      let expectedResponse: ITriviaResponse = {
        errorMessage: 'Out of questions for the token.',
        questions: [],
      };

      expect(trivia).toEqual(expectedResponse);
    });
  });

  describe('has 3 retries that all result in HTTP Errors', () => {
    it('should return a trivia response with an empty array and error message', async () => {
      const mockDataTokenHTTPError = {
        response_code: -1,
        results: [],
      } as IQuestionResponse;

      getQuestions.mockReturnValue(Promise.resolve(mockDataTokenHTTPError));
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));
      const trivia = await getNextSetOfQuestions(10, 'A_SESSION_TOKEN');
      let expectedResponse: ITriviaResponse = {
        errorMessage: 'An error has occurred.',
        questions: [],
      };

      expect(trivia).toEqual(expectedResponse);
    });
  });

  describe('has 3 retries that all result in Unknown Response Code', () => {
    it('should return a trivia response with an empty array and error message', async () => {
      const mockDataTokenUnknownResponseCode = {
        response_code: 5,
        results: [],
      } as IQuestionResponse;

      getQuestions.mockReturnValue(
        Promise.resolve(mockDataTokenUnknownResponseCode),
      );
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));
      const trivia = await getNextSetOfQuestions(10, 'A_SESSION_TOKEN');
      let expectedResponse: ITriviaResponse = {
        errorMessage: 'An error has occurred.',
        questions: [],
      };

      expect(trivia).toEqual(expectedResponse);
    });
  });
});
