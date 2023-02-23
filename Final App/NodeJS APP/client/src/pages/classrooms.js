import React, { useContext, useState } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Modal,
  Divider,
  Grid,
  Stack,
  Card,
  TextField,
  CardContent,
  Typography,
} from "@mui/material";

import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 250,
  bgcolor: "background.paper",
  borderRadius: 6,
  boxShadow: 24,
  textAlign: "center",
  p: 4,
};

export const Classrooms = () => {
  const { user, joinClass } = useContext(AuthContext);
  const [isloading, setIsLoading] = useState(true);
  const [classrooms, setClassrooms] = React.useState([]);

  const [name, setName] = React.useState("");
  const [section, setSection] = React.useState("");
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const GetClassrooms = () => {
    setIsLoading(true);
    axios
      .get(`http://localhost:5000/api/teacher/allclassrooms/${user.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        setClassrooms(res.data.classrooms);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleCreateNewClassroom = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5000/api/teacher/createclassroom",
        JSON.stringify({ name: `${name}-${section}`, teacherid: user.id }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);

        GetClassrooms();
        setName("");
        setSection("");
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    console.log(user);
    if (user) GetClassrooms();
  }, [user]);

  return (
    <>
      {!isloading ? (
        <Box height="100vh">
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography variant="h6" sx={{ fontWeight: "bold", pb: 2 }}>
                Create a new Classroom
              </Typography>
              <Stack spacing={2}>
                <TextField
                  placeholder="Class Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  placeholder="Class Section"
                  onChange={(e) => setSection(e.target.value)}
                  size="medium"
                />
              </Stack>
              <Button
                variant="contained"
                sx={{ mt: 2, mb: 2, float: "right" }}
                disabled={name === "" || section === ""}
                onClick={handleCreateNewClassroom}
              >
                Create
              </Button>
            </Box>
          </Modal>
          <Typography
            variant="h3"
            sx={{ textAlign: "center", pt: 2, pb: 2, fontWeight: "bold" }}
          >
            All Classrooms
          </Typography>
          <Divider />
          <Button
            variant="contained"
            sx={{ mt: 2, mb: 2, float: "right" }}
            onClick={handleOpen}
          >
            Create New Classroom
          </Button>

          <Grid container spacing={2} mt={5}>
            {classrooms.map((classroom) => (
              <Grid item key={classroom._id}>
                <Card>
                  <CardContent textAlign="center">
                    <Stack spacing={2}>
                      <Stack spacing={2} direction="row">
                        <Typography
                          variant="subtitle1"
                          sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          Class Name :
                        </Typography>
                        <Typography variant="subtitle1">
                          {classroom.name}
                        </Typography>
                      </Stack>
                      <Stack spacing={2} direction="row">
                        <Typography
                          variant="subtitle1"
                          sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          Code :
                        </Typography>
                        <Typography variant="subtitle1">
                          {classroom._id}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Button
                      variant="contained"
                      sx={{ mt: 2, mb: 2, float: "right" }}
                      onClick={() => {
                        joinClass(classroom._id);
                        navigate(`/teacher/class/${classroom._id}`);
                      }}
                    >
                      View
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Loading...
        </Typography>
      )}
    </>
  );
};
