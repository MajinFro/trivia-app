import {getSessionToken} from '../api';
import {OTDB_TOKEN_URL} from '../../constants';
import axios from 'axios';
import {ITokenResponse} from '../models';

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
  token: 'A_SESSION_TOKEN',
} as ITokenResponse;

describe('successful response', () => {
  it('should return data from response', async () => {
    mockAxios.get.mockResolvedValue({
      data: mockData,
      status: 200,
    });

    const token = await getSessionToken({
      command: 'request',
    });

    let expectedURL = `${OTDB_TOKEN_URL}?command=request`;
    expect(token).toEqual(mockData);
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

    const token = await getSessionToken({
      command: 'reset',
      token: 'A_SESSION_TOKEN',
    });

    let expectedURL = `${OTDB_TOKEN_URL}?command=reset&token=A_SESSION_TOKEN`;
    let expectedData = {response_code: -1};

    expect(token).toEqual(expectedData);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(expectedURL);
  });
});
