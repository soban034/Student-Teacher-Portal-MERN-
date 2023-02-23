import { Routes, Route } from "react-router-dom";
import {
  Teacher,
  Student,
  StudentClass,
  Class,
  Classrooms,
  Assignment,
  OngoingTask,
  Admin,
  AdminClass,
  AdminTask,
  AdminStudents,
} from "./pages";
import { AuthContext } from "./context/auth.context";
import { StudentContext } from "./context/student.context";
import { useAuth } from "./hooks/auth.hook";
import { useStudentAuth } from "./hooks/student.hook";

import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { themeConfig } from "./theme";

function App() {
  const theme = createTheme(themeConfig);

  const { login, logout, joinClass, user, socket } = useAuth();
  const { studentLogin, studentSocket, studentJoinClass, student } =
    useStudentAuth();
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthContext.Provider
          value={{
            isLoggedIn: user === null ? false : true,
            user,
            socket,
            joinClass,
            login,
            logout,
          }}
        >
          <StudentContext.Provider
            value={{
              isLoggedIn: student === null ? false : true,
              student,
              studentSocket,
              studentLogin,
              studentJoinClass,
            }}
          >
            <Routes>
              <Route exact path="/" element={<Teacher />} />
              <Route exact path="/teacher" element={<Teacher />} />
              <Route exact path="/student" element={<Student />} />
              <Route exact path="/admin" element={<Admin />} />
              <Route exact path="/admin/class" element={<AdminClass />} />
              <Route
                exact
                path="/admin/class/:classid"
                element={<AdminTask />}
              />
              <Route exact path="/admin/student" element={<AdminStudents />} />
              <Route
                exact
                path="/student/classroom/:cid"
                element={<StudentClass />}
              />
              <Route exact path="/teacher/classroom" element={<Classrooms />} />
              <Route exact path="/teacher/class/:cid" element={<Class />} />
              <Route
                exact
                path="/teacher/assignment/:aid"
                element={<OngoingTask />}
              />
              <Route
                exact
                path="/teacher/classroom/class/:cid/assignment"
                element={<Assignment />}
              />
            </Routes>
          </StudentContext.Provider>
        </AuthContext.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
