import create from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string;
  setToken: (e: string) => void;
}

export const useAuthStore = create<AuthState>(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => set({ token }),
    }),
    {
      name: "token-storage",
      getStorage: () => localStorage,
    }
  )
);
