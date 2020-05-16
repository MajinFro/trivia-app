import {getTrivia} from '../api';
import {OTDB_URL} from '../../constants';
import axios from 'axios';
import {IQuestionResponse} from '../models';

jest.mock('axios');
let mockAxios: jest.Mocked<typeof axios>;

beforeEach(() => {
  mockAxios = axios as jest.Mocked<typeof axios>;
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockData = {
  response_code: 0,
  results: [
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
  ],
} as IQuestionResponse;

describe('successful response', () => {
  it('should return data from response', async () => {
    mockAxios.get.mockResolvedValue({
      data: mockData,
      status: 200,
    });

    const trivia = await getTrivia({
      amount: 10,
      type: 'boolean',
      token: 'A_TOKEN',
    });

    let expectedURL = `${OTDB_URL}?amount=10&token=A_TOKEN&type=boolean`;
    expect(trivia).toEqual(mockData);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(expectedURL);
  });
});

describe('http error response', () => {
  it('should return data with error state', async () => {
    mockAxios.get.mockResolvedValue({
      data: mockData,
      status: 404,
    });

    const trivia = await getTrivia({
      amount: 10,
      type: 'boolean',
    });

    let expectedURL = `${OTDB_URL}?amount=10&type=boolean`;
    let expectedData = {response_code: -1, results: []};

    expect(trivia).toEqual(expectedData);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(expectedURL);
  });
});
