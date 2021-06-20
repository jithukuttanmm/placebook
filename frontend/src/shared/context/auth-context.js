import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  setUser: () => {},
  user: null,
  login: () => {},
  logout: () => {},
  token: null,
  setToken: () => {},
});
