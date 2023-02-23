import React, { useContext } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Divider,
  Stack,
  Card,
  Typography,
  TextField,
} from "@mui/material";

import { Alert } from "../components/Alert";
import { useNavigate } from "react-router-dom";
import { StudentContext } from "../context/student.context";

export const Student = () => {
  const navigate = useNavigate();
  const { studentLogin, studentJoinClass } = useContext(StudentContext);
  const [registrationNumber, setRegistrationNumber] = React.useState("");
  const [classroomid, setClassroomid] = React.useState("");

  const handleJoinClass = () => {
    axios
      .post(
        "http://localhost:5000/api/student/joinclass",
        JSON.stringify({ registrationNumber, classroomid }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        studentLogin(res.data.student, classroomid);
        studentJoinClass(res.data.student, classroomid);
        navigate(`/student/classroom/${classroomid}`);
      })
      .catch((err) => {
        console.log(err);
        alert("Error : Invalid Credentials");
      });
  };

  return (
    <Box height="100vh">
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%" }}
      >
        <Card sx={{ width: 550, p: 2 }}>
          <Typography
            variant="h4"
            sx={{ pt: 4, pb: 4, fontWeight: "bold", textAlign: "center" }}
          >
            Student's Portal
          </Typography>
          <Divider />
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
              Enter Registration Number
            </Typography>
            <TextField
              variant="outlined"
              size="medium"
              placeholder="i.e. XXXX-XXX-XXX"
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
              Enter Class Code
            </Typography>
            <TextField
              variant="outlined"
              size="medium"
              placeholder="i.e. 63b2f4d8cbd31295343980c3"
              onChange={(e) => setClassroomid(e.target.value)}
            />
            <Button variant="contained" size="large" onClick={handleJoinClass}>
              Join Class
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
};
