import { createContext } from "react";

export const StudentContext = createContext({
  isLoggedIn: false,
  registrationNumber: null,
  studentSocket: null,
  studentLogin: () => {},
  studentJoinClass: () => {},
});
