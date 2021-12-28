import create from "zustand";
import { Model } from "ts-types";

interface NotificationState {
  notifications: Model["Notification"][];
  setNotifications: (e: Model["Notification"][]) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
}));
