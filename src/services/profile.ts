
import { APIService } from './api-client';
import { Profile } from '../types';
import { UpdateProfileData } from '../types/profile';

export const fetchProfile = async (): Promise<Profile> => {
  const response = await APIService.get<Profile>(`/profile`);
  return response.data;
};



export const patchProfile = async (formData: UpdateProfileData): Promise<Profile> => {
  const response = await APIService.patch<Profile>(`/profile`, formData);
  return response.data;
};




