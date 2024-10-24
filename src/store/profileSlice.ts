import { StateCreator } from 'zustand';
import { Profile } from '../types';
import { fetchProfile, patchProfile } from '../services/profile';
import { UpdateProfileData } from '../types/profile';

export interface ProfileSLice {
  profile: null | Profile;
  setProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  deleteProfile: () => void;
}

export const createProfileSlice: StateCreator<ProfileSLice> = set => ({
  profile: null,
  setProfile: async () => {
    const profile = await fetchProfile();
    set({ profile });
  },

  updateProfile: async data => {
    const profile = await patchProfile(data);
    set({ profile });
  },

  deleteProfile: () => {
    set({ profile: null });
  },
});
