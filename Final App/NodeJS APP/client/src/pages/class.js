import axios from "axios";
import {
  Button,
  Box,
  Divider,
  Grid,
  Stack,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
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

import Countdown from "react-countdown";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function prependZero(number) {
  if (number <= 9) return "0" + number;
  else return number;
}

// Random component
const Completionist = () => (
  <Box
    sx={{
      border: "1px dashed red",
      borderRadius: "10px",
      background: "linear-gradient(to right, #ed213a, #93291e)",
      p: "2",
      width: "50%",
      margin: "auto",
    }}
  >
    <Typography
      variant="h3"
      sx={{ pt: 4, pb: 4, fontWeight: "bold", textAlign: "center" }}
    >
      Time is Up!
    </Typography>
  </Box>
);

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a complete state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <Box
        sx={{
          border: "1px dashed red",
          borderRadius: "10px",
          background: "linear-gradient(to right, #ed213a, #93291e)",
          p: "2",
          width: "50%",
          margin: "auto",
        }}
      >
        <Typography
          variant="h5"
          sx={{ pt: 4, pb: 4, fontWeight: "bold", textAlign: "center" }}
        >
          Time Left : {prependZero(days)}:{prependZero(hours)}:
          {prependZero(minutes)}:{prependZero(seconds)}
        </Typography>
      </Box>
    );
  }
};

export const Class = () => {
  const { socket, joinClass } = useContext(AuthContext);
  const { cid } = useParams();
  const navigate = useNavigate();
  const [isloading, setIsLoading] = React.useState(true);
  const [classDetails, setClassDetails] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  const [latestAssignment, setLatestAssignment] = React.useState({});
  const [allsubmissions, setAllSubmissions] = React.useState([]);
  const [timeExtensionRequests, setTimeExtensionRequests] = React.useState({
    5: 0,
    10: 0,
    15: 0,
  });
  const [dueTime, setDueTime] = React.useState(0);
  const [allsubmissionsStatus, setAllSubmissionsStatus] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const [openAns, setOpenAns] = React.useState(false);
  const [tempname, setTempname] = useState("");
  const [tempdes, setTempdes] = useState("");
  const [tempSubTask, setTempSubTask] = useState([]);
  const [tempDate, setTempDate] = useState("");
  const [tempTime, setTempTime] = useState("");
  const [question, setQuestion] = useState([]);
  const [tempques, setTempques] = useState({});
  const [open2, setOpen2] = React.useState(false);
  const [quesans, setQuesans] = useState([]);
  const [diablebtn, setDiablebtn] = useState(false);
  const handleClose2 = () => setOpen2(false);

  const handleOpen = (tindex) => {
    setTempname(latestAssignment.task.name);
    setTempdes(latestAssignment.task.description);
    setTempSubTask(latestAssignment.task.subTasks);
    setTempDate(moment(latestAssignment.dueDate).format("YYYY-MM-DD"));
    setTempTime(moment(latestAssignment.dueDate).format("HH:mm"));
    setOpen(true);
  };
  const [tid, setTid] = useState(0);
  const handleCloseAns = () => setOpenAns(false);
  const handleModalOpen = (ques) => {
    setTempques(ques);
    setOpen2(true);
    console.log(ques);
  };
  const handleOpenAns = (idx) => {
    setTid(idx);
    setOpenAns(true);
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
        `http://localhost:5000/api/teacher/updateTask/${latestAssignment._id}`,
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
        getClassDetails(cid);
        socket.emit("new-assignment", res.data.assignment, cid);
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddAnswer = (sid) => {
    socket.emit("new-answer", sid, quesans, cid);
    setOpen2(false);
  };

  const handleClose = () => {
    handleUpdateTask();
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

  const getClassDetails = async (cid) => {
    axios
      .get(`http://localhost:5000/api/teacher/class/${cid}`)
      .then((res) => {
        setClassDetails(res.data.classroom);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getClassStudents = async (cid) => {
    axios
      .get(`http://localhost:5000/api/teacher/class/${cid}/students`)
      .then((res) => {
        setStudents(res.data.students);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllSubmissions = async (aid) => {
    axios
      .get(
        `http://localhost:5000/api/teacher/getsubmissions/${latestAssignment._id}`
      )
      .then((res) => {
        console.log(res.data);
        setAllSubmissions(res.data.submissions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTimeExtensionRequest = async (assignmentID) => {
    axios
      .get(
        `http://localhost:5000/api/teacher/timeextensionrequests/${assignmentID}`
      )
      .then((res) => {
        console.log(res.data);
        setTimeExtensionRequests(res.data.requests);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleGetAssignmentStatus = (aid) => {
    axios
      .get(`http://localhost:5000/api/teacher/getAssignmentStatus/${aid}`)
      .then((res) => {
        console.log(res.data);
        setAllSubmissionsStatus(res.data.progress);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getquestions = async (aid) => {
    axios
      .get(`http://localhost:5000/api/studentques/getallquestions/${aid}`)
      .then((res) => {
        console.log(res.data);
        setQuestion(res.data.questions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    if (cid) {
      joinClass(cid);
      getClassDetails(cid);
      getClassStudents(cid);
    }
  }, [cid]);

  useEffect(() => {
    const findlatestAssignment = () => {
      const finddoc = classDetails.assignments.reduce((prev, current) => {
        return new Date(prev.createdAt) > new Date(current.createdAt)
          ? prev
          : current;
      });
      return finddoc;
    };
    if (
      classDetails &&
      Object.keys(classDetails).length > 0 &&
      classDetails.assignments &&
      classDetails.assignments.length > 0
    ) {
      const latest = findlatestAssignment();
      setLatestAssignment(latest);
      setDueTime(latest.dueDate);
      handleGetAssignmentStatus(latest._id);
      getquestions(latest._id);
    }
  }, [classDetails, latestAssignment]);

  useEffect(() => {
    socket.on("student-joined", (student) => {
      getClassStudents(cid);
    });
    socket.on("get-new-submission", (newsubmission) => {
      setAllSubmissions((prev) => [...prev, newsubmission]);
    });
    socket.on("get-extra-time", (request) => {
      console.log(request);
      getTimeExtensionRequest(request);
    });

    socket.on("student-status", (aid) => {
      handleGetAssignmentStatus(aid);
    });

    socket.on("student-typing", (studentid, progress) => {
      // console.log(studentid, progress);
      // let found = stuprogress.find((stu) => stu._id === studentid)
      //   ? true
      //   : false;
      // console.log(found);
      // if (found) {
      //   let data = [...stuprogress];
      //   let index = data.findIndex((stu) => stu._id === studentid);
      //   data[index].progress = progress;
      //   setstuProgress(data);
      // } else {
      //   setstuProgress((prev) => [...prev, { _id: studentid, progress }]);
      // }
      // console.log(stuprogress);
    });

    socket.on("get-new-question", (question) => {
      getquestions(question.assignmentid);
    });
  }, []);

  useEffect(() => {
    if (classDetails && students) {
      setIsLoading(false);
    }
  }, [classDetails, students]);

  useEffect(() => {
    if (latestAssignment && latestAssignment._id) {
      getAllSubmissions(latestAssignment._id);
      getTimeExtensionRequest(latestAssignment._id);
    }
  }, [latestAssignment]);

  const handleGiveExtraTime = (time, aid) => {
    let newTime = new Date(dueTime).getTime() + time * 60000;
    axios
      .post(
        `http://localhost:5000/api/teacher/extendTime`,
        JSON.stringify({ time: newTime, aid }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setDueTime(newTime);
        socket.emit("dueTime-updated", newTime, cid);
      })
      .catch((err) => {
        console.log(err);
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
      {isloading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box height="100vh">
          <Rodal
            visible={openAns}
            onClose={handleCloseAns}
            animation="zoom"
            width={600}
            height="100vh"
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Assignment Answer
              </Typography>
              <Divider />
              <Box sx={{ overflow: "auto", height: "100vh" }}>
                {allsubmissions && allsubmissions.length > 0 ? (
                  allsubmissions.find((answer) => answer.studentid === tid) ? (
                    <Stack spacing={2}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", textAlign: "center", mt: 2 }}
                      >
                        Answer
                      </Typography>
                      <Typography variant="body1" sx={{ textAlign: "center" }}>
                        {allsubmissions &&
                          allsubmissions.length > 0 &&
                          allsubmissions.find(
                            (answer) => answer.studentid === tid
                          ).submission.answer}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", textAlign: "center" }}
                      >
                        Sub Task Answers
                      </Typography>
                      {allsubmissions &&
                      allsubmissions.length > 0 &&
                      allsubmissions.find((answer) => answer.studentid === tid)
                        .submission.subTasks.length > 0 ? (
                        allsubmissions
                          .find((answer) => answer.studentid === tid)
                          .submission.subTasks.map((subtask, index) => (
                            <>
                              <Typography
                                variant="body1"
                                sx={{ textAlign: "center" }}
                              >
                                SubTask: {index + 1}
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ textAlign: "center" }}
                              >
                                {subtask.answer}
                              </Typography>
                            </>
                          ))
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{ textAlign: "center" }}
                        >
                          No Sub Task Answers
                        </Typography>
                      )}
                    </Stack>
                  ) : (
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      No Answers Yet
                    </Typography>
                  )
                ) : (
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    No Answers Yet
                  </Typography>
                )}
              </Box>
            </Box>
          </Rodal>
          {/* {
            ========================================================
          } */}
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
                    value={latestAssignment && tempname}
                    onChange={(e) => {
                      setTempname(e.target.value);
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Assignment Description
                  </Typography>
                  <TextField
                    value={latestAssignment && tempdes}
                    onChange={(e) => {
                      setTempdes(e.target.value);
                    }}
                  />
                </Stack>
                {latestAssignment &&
                  Object.keys(latestAssignment).length > 0 &&
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
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Sub Task Name
                        </Typography>
                        <TextField
                          value={subtask.name}
                          onChange={(e) => {
                            handleAddNewSubTaskName(subtaskIdx, e.target.value);
                          }}
                        />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
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
          {/* {
            ========================================================
          } */}
          <Rodal
            visible={open2}
            onClose={handleClose2}
            animation="zoom"
            width={600}
          >
            <Box sx={{ overflow: "auto", height: "100vh" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Question
              </Typography>
              <Divider />
              <Box>
                <Stack spacing={2}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    {tempques && tempques.question}
                  </Typography>
                  <TextField onChange={(e) => setQuesans(e.target.value)} />
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleAddAnswer(tempques.studentid);
                    }}
                  >
                    Send Answer
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Rodal>
          <Stack direction="row" spacing={4} justifyContent="center">
            <Typography variant="h3" sx={{ pt: 4, pb: 4, fontWeight: "bold" }}>
              Class :
            </Typography>
            <Typography variant="h3" sx={{ pt: 4, pb: 4 }}>
              {classDetails.name}
            </Typography>
          </Stack>
          <Divider />
          <Button
            variant="contained"
            sx={{ mt: 4, mb: 4, float: "right" }}
            onClick={() =>
              navigate(`/teacher/classroom/class/${cid}/assignment`)
            }
          >
            Create New Assignment
          </Button>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                variant="h5"
                sx={{ pt: 2, pb: 2, fontWeight: "bold", textAlign: "center" }}
              >
                Students Enrolled
              </Typography>
              <Card>
                <CardContent>
                  {students && students.length === 0 ? (
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Nothing to View
                    </Typography>
                  ) : (
                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Registration #</TableCell>
                            <TableCell align="center">Student Name</TableCell>
                            <TableCell align="center">Question</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Submitted</TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {students.map((student) => (
                            <TableRow
                              key={student.registrationNumber}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell align="center">
                                {student.registrationNumber}
                              </TableCell>
                              <TableCell align="center">
                                {student.name}
                              </TableCell>
                              <TableCell align="center">
                                {question.find(
                                  (question, idx) =>
                                    question.studentid === student._id
                                ) ? (
                                  <IconButton
                                    onClick={() =>
                                      handleModalOpen(
                                        question.find(
                                          (question) =>
                                            question.studentid === student._id
                                        )
                                      )
                                    }
                                  >
                                    👋
                                  </IconButton>
                                ) : (
                                  <Typography>🤷‍♂️</Typography>
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {allsubmissionsStatus &&
                                allsubmissionsStatus.length > 0 ? (
                                  allsubmissionsStatus.find(
                                    (submission) =>
                                      submission.studentid === student._id
                                  ) ? (
                                    <Typography>
                                      {
                                        allsubmissionsStatus.find(
                                          (submission) =>
                                            submission.studentid === student._id
                                        ).status
                                      }
                                    </Typography>
                                  ) : (
                                    <Typography>In Progress</Typography>
                                  )
                                ) : (
                                  <Typography>In Progress</Typography>
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {allsubmissions && allsubmissions.length > 0 ? (
                                  allsubmissions.find(
                                    (submission) =>
                                      submission.studentid === student._id
                                  ) ? (
                                    <Typography>Submitted</Typography>
                                  ) : (
                                    <Typography>Not Submitted</Typography>
                                  )
                                ) : (
                                  <Typography>Not Submitted</Typography>
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  variant="contained"
                                  onClick={() => handleOpenAns(student._id)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="h5"
                sx={{ pt: 2, pb: 2, fontWeight: "bold", textAlign: "center" }}
              >
                On Going Assignment
              </Typography>
              <Card pt="4">
                <CardContent>
                  {Object.keys(classDetails).length > 0 &&
                  classDetails.assignments.length !== 0 &&
                  Object.keys(latestAssignment).length > 0 ? (
                    <>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Assignment Id : {latestAssignment._id}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                          mb: 4,
                        }}
                      >
                        Assignment Name : {latestAssignment.task.name}
                      </Typography>

                      <Countdown
                        date={dueTime}
                        renderer={renderer}
                        onComplete={() => {
                          setDiablebtn(true);
                        }}
                      />
                      <Box
                        sx={{
                          border: "1px solid gray",
                          borderRadius: "10px",
                          shadow: "1px 1px 1px 1px gray",
                          p: 2,
                          mt: 2,
                          mb: 2,
                        }}
                      >
                        <Box sx={{ mt: 3, mb: 3 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", textAlign: "center" }}
                          >
                            Number of Students Requested Extra Time:
                          </Typography>
                          <Stack spacing={2} sx={{ mt: 2, mb: 2 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold", textAlign: "center" }}
                            >
                              +5 Minutes : &nbsp;
                              {timeExtensionRequests &&
                              timeExtensionRequests.length > 0 ? (
                                timeExtensionRequests.filter(
                                  (request) => request.requestedTime === 5
                                ).length +
                                "/" +
                                classDetails.students.length
                              ) : (
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: "bold",
                                    textAlign: "center",
                                  }}
                                >
                                  {0 + "/" + classDetails.students.length}
                                </Typography>
                              )}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold", textAlign: "center" }}
                            >
                              +10 Minutes : &nbsp;
                              {timeExtensionRequests &&
                              timeExtensionRequests.length > 0 ? (
                                timeExtensionRequests.filter(
                                  (request) => request.requestedTime === 10
                                ).length +
                                "/" +
                                classDetails.students.length
                              ) : (
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: "bold",
                                    textAlign: "center",
                                  }}
                                >
                                  {0 + "/" + classDetails.students.length}
                                </Typography>
                              )}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold", textAlign: "center" }}
                            >
                              +15 Minutes : &nbsp;
                              {timeExtensionRequests &&
                              timeExtensionRequests.length > 0 ? (
                                timeExtensionRequests.filter(
                                  (request) => request.requestedTime === 15
                                ).length +
                                "/" +
                                classDetails.students.length
                              ) : (
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: "bold",
                                    textAlign: "center",
                                  }}
                                >
                                  {0 + "/" + classDetails.students.length}
                                </Typography>
                              )}
                            </Typography>
                          </Stack>
                        </Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Give Extra Time to Students
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={4}
                          justifyContent="center"
                          sx={{ mt: 1 }}
                        >
                          <Button
                            variant="contained"
                            disabled={diablebtn}
                            onClick={() =>
                              handleGiveExtraTime(5, latestAssignment._id)
                            }
                          >
                            + 5 Minutes
                          </Button>
                          <Button
                            variant="contained"
                            disabled={diablebtn}
                            onClick={() =>
                              handleGiveExtraTime(10, latestAssignment._id)
                            }
                          >
                            + 10 Minutes
                          </Button>
                          <Button
                            variant="contained"
                            disabled={diablebtn}
                            onClick={() =>
                              handleGiveExtraTime(15, latestAssignment._id)
                            }
                          >
                            + 15 Minutes
                          </Button>
                        </Stack>
                      </Box>
                      <Box
                        sx={{
                          mt: 4,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => handleOpen()}
                        >
                          View Assignment
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      No ongoing Assignments
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};
