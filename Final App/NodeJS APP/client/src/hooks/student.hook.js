import { useState, useCallback, useEffect } from "react";
import socketConnection from "socket.io-client";

export const useStudentAuth = () => {
  const [student, setStudent] = useState(null);
  const studentSocket = socketConnection("http://localhost:5000/api/socket");
  const studentLogin = useCallback((student, roomid) => {
    setStudent(student);
    studentSocket.emit("join-room", roomid);
    localStorage.setItem(
      "StudentData",
      JSON.stringify({
        student,
        roomid,
      })
    );
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("StudentData"));
    if (storedData && storedData.student) {
      studentLogin(storedData.student, storedData.roomid);
    }
  }, [studentLogin]);

  const studentJoinClass = useCallback((student, roomid) => {
    studentSocket.emit("join-room", roomid);
    studentSocket.emit("student-join", student, roomid);
  }, []);

  return { studentLogin, studentJoinClass, studentSocket, student };
};
