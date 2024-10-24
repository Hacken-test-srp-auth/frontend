import { APIService } from './api-client';

interface InitLoginResponse {
  salt: string;
  serverPublicKey: string;
}
export const initLogin = async (email: string): Promise<InitLoginResponse> => {
  const response = await APIService.post('/auth/login-init', { email });
  return response.data;
};

interface CompleteLoginResponse {
  M2: string;
  accessToken: string;
  refreshToken: string;
}

export const completeLogin = async (
  email: string,
  clientPublicKey: string,
  clientProof: string
): Promise<CompleteLoginResponse> => {
  const response = await APIService.post('/auth/login-complete', {
    email,
    clientPublicKey,
    clientProof,
  });
  return response.data;
};

export const logOut = async (refreshToken: string): Promise<void> => {
  await APIService.post('/auth/logout', { refreshToken });
};

export interface RegistrationRequestData {
  username: string;
  email: string;
  name: string;
  salt: string;
  verifier: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const register = async (
  formData: RegistrationRequestData
): Promise<TokenResponse> => {
  const response = await APIService.post('/auth/register', formData);
  return response.data;
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<TokenResponse> => {
  const response = await APIService.post('/auth/refresh', { refreshToken });
  return response.data;
};
