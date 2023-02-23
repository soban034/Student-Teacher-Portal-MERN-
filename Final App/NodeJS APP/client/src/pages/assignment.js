import React, { useContext, useState } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Divider,
  TextField,
  Stack,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

export const Assignment = () => {
  const { socket } = useContext(AuthContext);
  const { cid } = useParams();
  const navigate = useNavigate();
  const [subTasks, setSubTasks] = useState([]);
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentDeadline, setAssignmentDeadline] = useState({
    date: "",
    time: "",
  });

  const handleAddsubTask = () => {
    setSubTasks([
      ...subTasks,
      { id: subTasks.length + 1, name: "", description: "" },
    ]);
  };

  const handleRemovesubTask = (id) => {
    setSubTasks(subTasks.filter((subTask) => subTask.id !== id));
  };

  const handleAddNewSubTaskName = (id, name) => {
    let data = [...subTasks];
    data[id - 1].name = name;
    setSubTasks(data);
  };

  const handleAddNewSubTaskDes = (id, description) => {
    let data = [...subTasks];
    data[id - 1].description = description;
    setSubTasks(data);
  };

  const handleAddNewAssignment = () => {
    axios
      .post(
        "http://localhost:5000/api/teacher/postassignment",
        JSON.stringify({
          classroomid: cid,
          task: {
            name: assignmentName,
            description: assignmentDescription,
            subTasks: subTasks,
          },
          dueDate: new Date(
            assignmentDeadline.date + "T" + assignmentDeadline.time
          ).getTime(),
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        socket.emit("new-assignment", res.data.assignment, cid);
        navigate(`/teacher/class/${cid}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box height="100vh">
      <Typography
        variant="h4"
        sx={{ pt: 4, pb: 4, fontWeight: "bold", textAlign: "center" }}
      >
        Create new Assignment
      </Typography>
      <Divider />

      <Card sx={{ width: "50%", mx: "auto" }}>
        <CardContent>
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
            <TextField onChange={(e) => setAssignmentName(e.target.value)} />
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Assignment Description
            </Typography>
            <TextField
              onChange={(e) => setAssignmentDescription(e.target.value)}
            />
          </Stack>
          {subTasks.map((subTask) => (
            <React.Fragment key={subTask.id}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => handleRemovesubTask(subTask.id)}
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                  color="error"
                >
                  Remove Sub Task {subTask.id}
                </Button>
              </Box>
              <Stack spacing={2}>
                <Typography as="b" textAlign="center">
                  Sub Task {subTask.id}
                </Typography>
                <Typography as="b">Task Name</Typography>
                <TextField
                  onChange={(e) =>
                    handleAddNewSubTaskName(subTask.id, e.target.value)
                  }
                />
                <Typography as="b">Task Description</Typography>
                <TextField
                  onChange={(e) =>
                    handleAddNewSubTaskDes(subTask.id, e.target.value)
                  }
                />
              </Stack>
            </React.Fragment>
          ))}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={handleAddsubTask}
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              Add Sub Task
            </Button>
          </Box>

          <Divider />
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
              Assignment Deadline
            </Typography>
            <TextField
              type="date"
              onChange={(e) =>
                setAssignmentDeadline({
                  ...assignmentDeadline,
                  date: e.target.value,
                })
              }
            />
            <TextField
              type="time"
              onChange={(e) =>
                setAssignmentDeadline({
                  ...assignmentDeadline,
                  time: e.target.value,
                })
              }
            />
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
              onClick={handleAddNewAssignment}
            >
              Create Assignment
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
