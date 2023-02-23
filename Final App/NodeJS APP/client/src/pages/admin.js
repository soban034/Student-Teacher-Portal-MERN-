import React from "react";
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

export const Admin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "admin" || password === "admin") {
      navigate("/admin/class");
    } else {
    }
  };

  return (
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
                Admin's Login
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
  );
};
