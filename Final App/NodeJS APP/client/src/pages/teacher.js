import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  FormControl,
  Stack,
  Card,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";

import { Alert } from "../components/Alert";
import { AuthContext } from "../context/auth.context";

export const Teacher = () => {
  const [openAlert, setOpenAlert] = React.useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { login } = useContext(AuthContext);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:5000/api/teacher/login",
        JSON.stringify({ email, password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        login(res.data.teacher);
        navigate("/teacher/classroom");
      })
      .catch((err) => {
        alert("Error : Invalid Credentials");
      });
  };

  useEffect(() => {
    const openedassignments = async () => {
      axios
        .post("http://localhost:5000/api/teacher/changeStatus", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    openedassignments();
  }, []);

  return (
    <>
      <Box height="100vh">
        <Stack
          justifyContent="center"
          alignItems="center"
          direction="row"
          sx={{ height: "100%" }}
        >
          <Card
            sx={{
              width: 550,
              p: 2,
            }}
          >
            <CardContent>
              <Stack spacing={4}>
                <Typography
                  variant="h3"
                  sx={{ textAlign: "center", pt: 2, fontWeight: "bold" }}
                >
                  Teacher's Login
                </Typography>
                <FormControl>
                  <TextField
                    type="email"
                    placeholder="Email"
                    onChange={handleEmailChange}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    type="password"
                    placeholder="Password"
                    onChange={handlePasswordChange}
                  />
                </FormControl>
                <Button variant="contained" size="large" onClick={handleSubmit}>
                  Login
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </>
  );
};
