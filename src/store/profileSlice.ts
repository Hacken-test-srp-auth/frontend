import { StateCreator } from 'zustand';
import { Profile } from '../types';
import { fetchProfile } from '../services/profile';

export interface ProfileSLice {
  profile: null| Profile,
  setProfile: () => Promise<void>;
}

export const createProfileSlice: StateCreator<ProfileSLice> = (set) => ({
  profile: null,
  setProfile: async () => {
    const profile = await fetchProfile()
    set({ profile });
  },

  deleteProfile: async () => {
    set({ profile : null});
  },
});
