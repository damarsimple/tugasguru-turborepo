import create from "zustand";
import { persist } from "zustand/middleware";
import { Model } from "../ts-types";

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
