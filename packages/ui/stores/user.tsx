import create from "zustand";
import { Model } from "ts-types";
import { persist } from "zustand/middleware";

type User = Model["User"]

interface UserStore {
  user: User | null | undefined;
  setUser: (e: User | null | undefined) => void;
}

export const useUserStore = create<UserStore>(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage", // unique name
    }
  )
);
