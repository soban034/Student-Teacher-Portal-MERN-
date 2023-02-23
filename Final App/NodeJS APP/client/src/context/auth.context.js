import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  socket: null,
  login: () => {},
  logout: () => {},
  joinClass: () => {},
});
