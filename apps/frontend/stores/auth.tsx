import Cookies from "js-cookie";
interface AuthState {
  token: string;
  setToken: (e: string) => void;
}

export const token = Cookies.get("token") || "";


export const useAuthStore = (): AuthState => {
  return {
    setToken: (token: string) => {
      Cookies.set("token", token);
    },
    token
  }
}