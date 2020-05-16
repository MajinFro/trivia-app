import axios, {AxiosResponse} from 'axios';
import {OTDB_TOKEN_URL} from '../constants';
import {ITokenRequest, ITokenResponse} from './models';
import queryString from 'query-string';

export const getSessionToken = async (
  request: ITokenRequest,
): Promise<ITokenResponse> => {
  let url: string = `${OTDB_TOKEN_URL}?${queryString.stringify(request)}`;
  const response: AxiosResponse<ITokenResponse> = await axios.get(url);

  return response.status !== 200 ? {response_code: -1} : response.data;
};
