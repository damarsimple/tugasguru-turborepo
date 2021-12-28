import create from "zustand";
import { Model } from "ts-types";

interface GameSetting {
  music: boolean;
  sound_effect: boolean;
  timer: boolean;
  memes: boolean;
  multiplayer: boolean;
}

interface GameState {
  index: number;
  myquizplayer: Model["Quizplayer"] | null | undefined;
  quizmatch: Model["Quizmatch"] | null | undefined;
  started: boolean;
  finished: boolean;

  setting: GameSetting;
  quizplayers: Model["Quizplayer"][];
  players: Model["User"][];

  setSetting: (by: GameSetting) => void;
  setQuizsession: (by: Model["Quizmatch"]) => void;
  setStarted: (by: boolean) => void;
  setFinished: (by: boolean) => void;
  setQuizplays: (by: Model["Quizplayer"][]) => void;
  setMyquizplayer: (by: Model["Quizplayer"] | null | undefined) => void;
  setPlayers: (by: Model["User"][]) => void;
  setIndex: (by: number) => void;
}

export const useQuizplayStore = create<GameState>((set) => ({
  index: 0,
  myquizplayer: null,
  quizmatch: null,
  finished: false,
  started: false,
  setting: {
    music: false,
    timer: false,
    sound_effect: false,
    memes: false,
    multiplayer: false,
  },
  quizPlay: [],
  players: [],
  quizplayers: [],

  setIndex: (index: number) => set({ index }),
  setQuizsession: (quizmatch) =>
    set({ quizmatch }),
  setSetting: (setting) => set({ setting }),
  setStarted: (started) => set({ started }),
  setFinished: (finished) => set({ finished }),
  setQuizplays: (quizplayers) => set({ quizplayers }),
  setMyquizplayer: (myquizplayer) =>
    set({ myquizplayer }),
  setPlayers: (players) => set({ players }),
}));
