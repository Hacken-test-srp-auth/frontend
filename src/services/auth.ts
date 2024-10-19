import { APIService } from "./api-client";

interface InitLoginResponse {
  salt:string;
  serverPublicKey:string;
}
export const initLogin = async (email: string):Promise<InitLoginResponse> => {
  const response = await APIService.post('/auth/login-init', { email });
  return response.data
}

interface CompleteLoginResponse {
  M2:string;
  accessToken:string;
  refreshToken:string;
}

export const completeLogin = async (email: string, clientPublicKey: string, clientProof: string):Promise<CompleteLoginResponse> => {
  const response = await APIService.post('/auth/login-complete', { email, clientPublicKey, clientProof });
  return response.data;
}

export const logOut = async (refreshToken: string):Promise<void> => {
  await APIService.post('/auth/logout', { refreshToken });
}

export interface RegistrationRequestData {
  username: string;
  email: string;
  name: string;
  salt:string;
  verifier: string;
}

export interface RegistrationResponse {
  accessToken:string;
  refreshToken:string;
}

export const register = async (formData: RegistrationRequestData):Promise<RegistrationResponse> => {
  const response = await APIService.post('/auth/registration', formData);
  return response.data;
}