import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Divider,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Rodal from "rodal";
import moment from "moment";

// include styles
import "rodal/lib/rodal.css";
import { useParams } from "react-router-dom";

export const AdminTask = () => {
  const { classid } = useParams();
  const [assignment, setAssignment] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [tid, setTid] = useState(0);
  const [tempname, setTempname] = useState("");
  const [tempdes, setTempdes] = useState("");
  const [tempSubTask, setTempSubTask] = useState([]);
  const [tempDate, setTempDate] = useState("");
  const [tempTime, setTempTime] = useState("");
  const handleOpen = (tindex) => {
    setTempname(assignment[tindex].task.name);
    setTempdes(assignment[tindex].task.description);
    setTempSubTask(assignment[tindex].task.subTasks);
    setTempDate(moment(assignment[tindex].dueDate).format("YYYY-MM-DD"));
    setTempTime(moment(assignment[tindex].dueDate).format("HH:mm"));
    setTid(tindex);
    setOpen(true);
  };

  const handleUpdateTask = () => {
    let data = {
      task: {
        name: tempname,
        description: tempdes,
        subTasks: tempSubTask,
      },
      dueDate: new Date(tempDate + "T" + tempTime).getTime(),
    };
    axios
      .put(
        `http://localhost:5000/api/admin/updateTask/${assignment[tid]._id}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setTempname("");
        setTempdes("");
        setTempSubTask([]);
        setTempDate("");
        setTempTime("");
        setTid(0);
        getAssignments();
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteAssignment = (id) => {
    axios
      .delete(`http://localhost:5000/api/admin/deleteTask/${id}`)
      .then((res) => {
        console.log(res);
        getAssignments();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = () => {
    handleUpdateTask();
  };
  const getAssignments = () => {
    axios
      .get(`http://localhost:5000/api/admin/getassginment/${classid}`)
      .then((res) => {
        console.log(res);
        setAssignment(res.data.assignments);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddsubTask = () => {
    setTempSubTask([
      ...tempSubTask,
      { id: tempSubTask.length, name: "", description: "" },
    ]);
  };

  const handleRemovesubTask = (id) => {
    let data = [...tempSubTask];
    data.splice(id, 1);
    setTempSubTask(data);
  };

  const handleAddNewSubTaskName = (id, name) => {
    let data = [...tempSubTask];
    data[id].name = name;
    setTempSubTask(data);
  };

  const handleAddNewSubTaskDes = (id, description) => {
    let data = [...tempSubTask];
    data[id].description = description;
    setTempSubTask(data);
  };

  useEffect(() => {
    getAssignments();
  }, []);

  return (
    <Box height="100vh">
      <Rodal
        visible={open}
        onClose={handleClose}
        animation="zoom"
        width={600}
        height="100vh"
      >
        <Box sx={{ overflow: "auto", height: "100vh" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Assignment Details
          </Typography>
          <Divider />
          <Box>
            <Stack spacing={2}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Task
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Assignment Name
              </Typography>
              <TextField
                value={assignment && assignment.length > 0 && tempname}
                onChange={(e) => {
                  setTempname(e.target.value);
                }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Assignment Description
              </Typography>
              <TextField
                value={assignment && assignment.length > 0 && tempdes}
                onChange={(e) => {
                  setTempdes(e.target.value);
                }}
              />
            </Stack>
            {assignment &&
              assignment.length > 0 &&
              tempSubTask.map((subtask, subtaskIdx) => (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Divider />
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      sx={{ mt: 2, mb: 2 }}
                      color="error"
                      onClick={() => {
                        handleRemovesubTask(subtaskIdx);
                      }}
                    >
                      Delete Sub Task
                    </Button>
                  </Box>

                  <Stack spacing={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Sub Task Name
                    </Typography>
                    <TextField
                      value={subtask.name}
                      onChange={(e) => {
                        handleAddNewSubTaskName(subtaskIdx, e.target.value);
                      }}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Sub Task Description
                    </Typography>
                    <TextField
                      value={subtask.description}
                      onChange={(e) => {
                        handleAddNewSubTaskDes(subtaskIdx, e.target.value);
                      }}
                    />
                  </Stack>
                  <Divider />
                </Box>
              ))}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                color="info"
                onClick={handleAddsubTask}
              >
                Add Sub Task
              </Button>
            </Box>

            <Divider />
            <Stack spacing={2}>
              <Typography
                variant="subtitle1"
                sx={{ mt: 2, fontWeight: "bold" }}
              >
                Assignment Deadline
              </Typography>
              <TextField
                type="date"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
              />
              <TextField
                type="time"
                value={tempTime}
                onChange={(e) => setTempTime(e.target.value)}
              />
            </Stack>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                onClick={handleClose}
              >
                Update Assignment
              </Button>
            </Box>
          </Box>
        </Box>
      </Rodal>
      <Typography
        variant="h4"
        sx={{ pt: 4, pb: 4, fontWeight: "bold", textAlign: "center" }}
      >
        All Assignments
      </Typography>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stack
          spacing={2}
          sx={{ p: 2, minWidth: 800 }}
          justifyContent="center"
          alignItems="center"
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Assignment Id</TableCell>
                  <TableCell align="center">Assignment Name</TableCell>
                  <TableCell align="center">Assignment Due Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
                {assignment && assignment.length > 0 ? (
                  assignment.map((row, index) => (
                    <TableRow
                      key={row._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">{row._id}</TableCell>
                      <TableCell align="center">{row.task.name}</TableCell>
                      <TableCell align="center">
                        {new Date(row.dueDate).toString()}
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          spacing={2}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpen(index)}
                          >
                            View
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteAssignment(row._id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={3}>
                      No Assignment Found
                    </TableCell>
                  </TableRow>
                )}
              </TableHead>
              <TableBody></TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    </Box>
  );
};
