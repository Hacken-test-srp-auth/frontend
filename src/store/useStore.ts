import { create } from 'zustand';

import { createProfileSlice, ProfileSLice, } from './profileSlice';
import { AuthSlice, createAuthSlice } from './authSlice';

export type AppState = AuthSlice & ProfileSLice

const useBoundStore = create<AppState>()((set, get, api) => ({
  ...createAuthSlice(set, get, api),
  ...createProfileSlice(set, get, api)
}));

export default useBoundStore;
