export interface ITokenRequest {
  command: string;
  token?: string;
}

export interface ITokenResponse {
  response_code: number;
  response_message?: string;
  token?: string;
}
