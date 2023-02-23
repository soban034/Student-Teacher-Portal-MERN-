import { useState, useCallback, useEffect } from "react";
import socketConnection from "socket.io-client";

export const useAuth = () => {
  const socket = socketConnection("http://localhost:5000/api/socket");
  const [user, setUser] = useState(false);

  const login = useCallback((user) => {
    setUser(user);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        user,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("userData");
  }, []);

  const joinClass = useCallback(
    (cid) => {
      socket.emit("join-room", cid);
    },
    [socket]
  );

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.user) {
      login(storedData.user);
    }
  }, [login]);

  return { login, logout, joinClass, user, socket };
};
