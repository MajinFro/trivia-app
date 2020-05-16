import {getNextSetOfQuestions} from '../trivia';
import {IQuestionResponse, IQuestion, ITokenResponse} from '../../api';

jest.mock('../../api', () => {
  const actualAPI = jest.requireActual('../../api');
  const getSessionTokenOriginalImplementation = actualAPI.getSessionToken;
  const getTriviaOriginalImplementation = actualAPI.getTrivia;
  return {
    ...actualAPI,
    getTrivia: jest.fn().mockImplementation(getTriviaOriginalImplementation),
    getSessionToken: jest
      .fn()
      .mockImplementation(getSessionTokenOriginalImplementation),
  };
});

import * as api from '../../api';

let tokenHandler: jest.Mock<any, any>;
let errorHandler: jest.Mock<any, any>;
let getTrivia: jest.SpyInstance;
let getSessionToken: jest.SpyInstance;

beforeEach(() => {
  tokenHandler = jest.fn();
  errorHandler = jest.fn();
  getTrivia = jest.spyOn(api, 'getTrivia');
  getSessionToken = jest.spyOn(api, 'getSessionToken');
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockQuestions = [
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
] as IQuestion[];

const tokenResponse = {
  response_code: 0,
  token: 'A_NEW_SESSION_TOKEN',
} as ITokenResponse;

describe('successful response from getNextSetOfQuestions', () => {
  const mockData = {
    response_code: 0,
    results: mockQuestions,
  } as IQuestionResponse;

  describe('when passed a token', () => {
    it('should return data from response', async () => {
      getTrivia.mockReturnValueOnce(Promise.resolve(mockData));
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));

      const trivia = await getNextSetOfQuestions(
        10,
        tokenHandler,
        errorHandler,
        'A_SESSION_TOKEN',
      );

      expect(trivia).toEqual(mockData.results);

      expect(tokenHandler).toHaveBeenCalledTimes(0);
      expect(errorHandler).toHaveBeenCalledTimes(0);

      expect(getTrivia).toHaveBeenCalledTimes(1);
      expect(getTrivia).toHaveBeenCalledWith({
        amount: 10,
        type: 'boolean',
        token: 'A_SESSION_TOKEN',
      });

      expect(getSessionToken).toHaveBeenCalledTimes(0);
    });
  });

  describe('when not passed a token', () => {
    it('should request a token and return data from the response', async () => {
      getTrivia.mockReturnValueOnce(Promise.resolve(mockData));
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));

      const trivia = await getNextSetOfQuestions(
        10,
        tokenHandler,
        errorHandler,
      );

      expect(trivia).toEqual(mockData.results);

      expect(tokenHandler).toHaveBeenCalledTimes(1);
      expect(tokenHandler).toHaveBeenCalledWith('A_NEW_SESSION_TOKEN');

      expect(errorHandler).toHaveBeenCalledTimes(0);

      expect(getTrivia).toHaveBeenCalledTimes(1);
      expect(getTrivia).toHaveBeenCalledWith({
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

      getTrivia
        .mockReturnValueOnce(Promise.resolve(mockDataTokenError))
        .mockReturnValueOnce(Promise.resolve(mockDataSuccessful));

      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));
      const trivia = await getNextSetOfQuestions(
        10,
        tokenHandler,
        errorHandler,
        'A_SESSION_TOKEN',
      );

      expect(trivia).toEqual(mockDataSuccessful.results);

      expect(tokenHandler).toHaveBeenCalledTimes(1);
      expect(tokenHandler).toHaveBeenCalledWith('A_NEW_SESSION_TOKEN');

      expect(errorHandler).toHaveBeenCalledTimes(0);

      expect(getTrivia).toHaveBeenCalledTimes(2);
      expect(getTrivia).toHaveBeenCalledWith({
        amount: 10,
        type: 'boolean',
        token: 'A_SESSION_TOKEN',
      });
      expect(getTrivia).toHaveBeenCalledWith({
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
        getTrivia.mockReturnValue(Promise.resolve(mockDataTokenError));

        getSessionToken
          .mockReturnValueOnce(Promise.resolve(tokenResponse))
          .mockReturnValueOnce(Promise.resolve(tokenResponse2));
      });

      it('should return empty array and call error handler', async () => {
        const trivia = await getNextSetOfQuestions(
          10,
          tokenHandler,
          errorHandler,
          'A_SESSION_TOKEN',
        );

        expect(trivia).toEqual([]);
        expect(errorHandler).toHaveBeenCalledTimes(1);
        expect(errorHandler).toHaveBeenCalledWith('Token not found.');
      });

      it('should attempt to get token twice', async () => {
        await getNextSetOfQuestions(
          10,
          tokenHandler,
          errorHandler,
          'A_SESSION_TOKEN',
        );

        expect(tokenHandler).toHaveBeenCalledTimes(2);
        expect(tokenHandler).toHaveBeenNthCalledWith(1, 'A_NEW_SESSION_TOKEN');
        expect(tokenHandler).toHaveBeenNthCalledWith(
          2,
          'A_NEW_SESSION_TOKEN_2',
        );
        expect(getSessionToken).toHaveBeenCalledTimes(2);
        expect(getSessionToken).toHaveBeenCalledWith({
          command: 'request',
        });
      });

      it('should attempt to get data 3 times', async () => {
        await getNextSetOfQuestions(
          10,
          tokenHandler,
          errorHandler,
          'A_SESSION_TOKEN',
        );

        expect(getTrivia).toHaveBeenCalledTimes(3);
        expect(getTrivia).toHaveBeenCalledWith({
          amount: 10,
          type: 'boolean',
          token: 'A_SESSION_TOKEN',
        });
        expect(getTrivia).toHaveBeenCalledWith({
          amount: 10,
          type: 'boolean',
          token: 'A_NEW_SESSION_TOKEN',
        });
        expect(getTrivia).toHaveBeenCalledWith({
          amount: 10,
          type: 'boolean',
          token: 'A_NEW_SESSION_TOKEN_2',
        });
      });
    });
  });

  describe('has 3 retries that all result in No Results Found', () => {
    it('should return empty array and call error handler', async () => {
      const mockDataNoResults = {
        response_code: 1,
        results: [],
      } as IQuestionResponse;

      getTrivia.mockReturnValue(Promise.resolve(mockDataNoResults));
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));
      const trivia = await getNextSetOfQuestions(
        10,
        tokenHandler,
        errorHandler,
        'A_SESSION_TOKEN',
      );

      expect(trivia).toEqual([]);
      expect(errorHandler).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledWith('No results found.');
    });
  });

  describe('has 3 retries that all result in Invalid Parameter', () => {
    it('should return empty array and call error handler', async () => {
      const mockDataInvalidParameter = {
        response_code: 2,
        results: [],
      } as IQuestionResponse;

      getTrivia.mockReturnValue(Promise.resolve(mockDataInvalidParameter));
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));
      const trivia = await getNextSetOfQuestions(
        10,
        tokenHandler,
        errorHandler,
        'A_SESSION_TOKEN',
      );

      expect(trivia).toEqual([]);
      expect(errorHandler).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledWith('Invalid parameter.');
    });
  });

  describe('has 3 retries that all result in Out Of Questions', () => {
    it('should return empty array and call error handler', async () => {
      const mockDataTokenOutOfQuestions = {
        response_code: 4,
        results: [],
      } as IQuestionResponse;

      getTrivia.mockReturnValue(Promise.resolve(mockDataTokenOutOfQuestions));
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));
      const trivia = await getNextSetOfQuestions(
        10,
        tokenHandler,
        errorHandler,
        'A_SESSION_TOKEN',
      );

      expect(trivia).toEqual([]);
      expect(errorHandler).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledWith(
        'Out of questions for the token.',
      );
    });
  });

  describe('has 3 retries that all result in HTTP Errors', () => {
    it('should return empty array and call error handler', async () => {
      const mockDataTokenHTTPError = {
        response_code: -1,
        results: [],
      } as IQuestionResponse;

      getTrivia.mockReturnValue(Promise.resolve(mockDataTokenHTTPError));
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));
      const trivia = await getNextSetOfQuestions(
        10,
        tokenHandler,
        errorHandler,
        'A_SESSION_TOKEN',
      );

      expect(trivia).toEqual([]);
      expect(errorHandler).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledWith('An error has occurred.');
    });
  });

  describe('has 3 retries that all result in Unknown Response Code', () => {
    it('should return empty array and call error handler', async () => {
      const mockDataTokenUnknownResponseCode = {
        response_code: 5,
        results: [],
      } as IQuestionResponse;

      getTrivia.mockReturnValue(
        Promise.resolve(mockDataTokenUnknownResponseCode),
      );
      getSessionToken.mockReturnValue(Promise.resolve(tokenResponse));
      const trivia = await getNextSetOfQuestions(
        10,
        tokenHandler,
        errorHandler,
        'A_SESSION_TOKEN',
      );

      expect(trivia).toEqual([]);
      expect(errorHandler).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledWith('An error has occurred.');
    });
  });
});
