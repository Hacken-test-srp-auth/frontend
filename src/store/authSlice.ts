import { StateCreator } from 'zustand';

export interface AuthSlice {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  isLoggedIn: false,
  setLoggedIn: (value: boolean) => {
    set({ isLoggedIn: value });
  },
});
