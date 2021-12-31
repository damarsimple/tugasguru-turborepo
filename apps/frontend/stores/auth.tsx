import Cookies from "js-cookie";
interface AuthState {
  token: string;
  setToken: (e: string) => void;
}

export const useAuthStore = (): AuthState => {
  const token = Cookies.get("token") || "";
  return {
    setToken: (token: string) => {
      Cookies.set("token", token);
    },
    token
  }
}