import axios, {AxiosResponse} from 'axios';
import {OTDB_URL} from '../constants';
import {IQuestionRequest, IQuestionResponse} from './models';
import queryString from 'query-string';

export const getQuestions = async (
  request: IQuestionRequest,
): Promise<IQuestionResponse> => {
  let url: string = `${OTDB_URL}?${queryString.stringify(request)}`;
  const response: AxiosResponse<IQuestionResponse> = await axios.get(url);

  return response.status !== 200
    ? {response_code: -1, results: []}
    : response.data;
};
