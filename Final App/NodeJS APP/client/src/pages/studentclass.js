import React, { useContext, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Divider,
  Stack,
  Grid,
  Typography,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Countdown from "react-countdown";
import { useParams } from "react-router-dom";
import { StudentContext } from "../context/student.context";
import { FaHandPaper } from "react-icons/fa";
import { IconContext } from "react-icons";
import Modal from "@mui/material/Modal";

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
      variant="h6"
      sx={{ pt: 4, pb: 4, fontWeight: "bold", textAlign: "center" }}
    >
      Time is Up!
    </Typography>
  </Box>
);

function prependZero(number) {
  if (number <= 9) return "0" + number;
  else return number;
}

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
          width: "80%",
          margin: "auto",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ pt: 4, pb: 4, fontWeight: "bold", textAlign: "center" }}
        >
          Time Left : {prependZero(days)}:{prependZero(hours)}:
          {prependZero(minutes)}:{prependZero(seconds)}
        </Typography>
      </Box>
    );
  }
};

export const StudentClass = () => {
  const { cid } = useParams();
  const { student, studentSocket, studentJoinClass } =
    useContext(StudentContext);
  const [assignment, setAssignment] = React.useState({});
  const [diablebtn, setDiablebtn] = React.useState(false);
  const [disableRequestBtn, setDisableRequestBtn] = React.useState(false);
  const [isloading, setIsLoading] = React.useState(true);
  const [taskanswer, setTaskAnswer] = React.useState("");
  const [subTasks, setsubTasks] = React.useState([]);
  const [dueTime, setDueTime] = React.useState(0);
  const [assignmentStatus, setAssignmentStatus] = React.useState("In Progress");
  const [getModal, setModal] = React.useState(false);
  const [askquestion, setaskquestion] = React.useState("");

  const checkExtraTimeRequest = useCallback((sid, aid) => {
    axios
      .post(
        `http://localhost:5000/api/student/checkrequestTime`,
        JSON.stringify({
          studentid: sid,
          assignmentid: aid,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.request) {
          setDisableRequestBtn(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleExtraTime = (num, sid, aid) => {
    setDisableRequestBtn(true);
    axios
      .post(
        `http://localhost:5000/api/student/requestTime`,
        JSON.stringify({
          extraTime: num,
          studentid: sid,
          assignmentid: aid,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        studentSocket.emit("request-extra-time", assignment._id, cid);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSetAssignmentStatus = useCallback(
    (sid, aid, status) => {
      axios
        .post(
          `http://localhost:5000/api/student/setStatus`,
          JSON.stringify({
            sid: sid,
            aid: aid,
            status: status,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res);
          setAssignmentStatus(res.data.progress.status);
          if (
            res.data.progress.status === "Completed" ||
            res.data.progress.status === "Give Up"
          ) {
            setDiablebtn(true);
            setDisableRequestBtn(true);
          }
          studentSocket.emit("post-status", assignment._id, cid);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [assignment._id, cid, studentSocket]
  );

  const calcutation = () => {
    let ans = taskanswer.length > 15 ? 100 : (taskanswer.length / 15) * 100;
    console.log(ans);
    let subtaskans = subTasks.reduce((acc, curr) => {
      return (
        acc +
        (curr.answer.length > 15
          ? 100 / subTasks.length
          : (curr.answer.length / 15) * 100)
      );
    }, 0);
    return ans + subtaskans;
  };

  const handleSubTaskAnswer = (id, answer) => {
    let data = [...subTasks];
    data[id].answer = answer;
    setsubTasks(data);
  };

  const handleClose = () => {
    setModal(false);
  };

  const newsubtask = useCallback(() => {
    if (
      Object.keys(assignment).length > 0 &&
      assignment.task &&
      Object.keys(assignment.task).length > 0 &&
      assignment.task.subTasks &&
      Object.keys(assignment.task.subTasks).length > 0
    ) {
      assignment.task.subTasks.forEach((subTask, index) => {
        const temparr = [...subTasks];
        if (temparr.length === 0) temparr.push({ id: index, answer: "" });
        else temparr[index] = { id: index, answer: "" };
        setsubTasks(temparr);
      });
    }
  }, [assignment]);

  const handleSubmitAssignment = () => {
    const data = {
      studentid: student.id,
      assignmentid: assignment._id,
      submission: {
        answer: taskanswer,
        subTasks: subTasks,
      },
    };
    axios
      .post(
        `http://localhost:5000/api/student/submitanswer`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        studentSocket.emit("new-submission", res.data.submission, cid);
        setDiablebtn(true);
        setDisableRequestBtn(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchClassroom = useCallback(async (cid, sid) => {
    setIsLoading(true);
    axios
      .get(`http://localhost:5000/api/student/classroom/${cid}/${sid}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        setAssignment(res.data.assignment);
        setDueTime(res.data.assignment.dueDate);
        // checkExtraTimeRequest(student.id, res.data.assignment._id);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    if (student !== null && student !== undefined)
      fetchClassroom(cid, student.id);
  }, [cid, fetchClassroom, student]);

  React.useEffect(() => {
    if (assignment) {
      setIsLoading(false);
      if (
        Object.keys(assignment).length > 0 &&
        assignment.task &&
        Object.keys(assignment.task).length > 0 &&
        assignment.task.subTasks &&
        Object.keys(assignment.task.subTasks).length > 0
      )
        newsubtask();
    }
  }, [assignment, newsubtask]);

  React.useEffect(() => {
    studentSocket.emit("join-room", cid);
    studentSocket.emit("student-join", student, cid);
    studentSocket.on("receive-message", (data) => {
      console.log(data);
    });
    studentSocket.on("get-dueTime-updated", (time) => {
      console.log(time);
      setDueTime(time);
    });
    studentSocket.on("get-new-assignment", (assignment) => {
      console.log(assignment);
      setAssignment(assignment);
      setDueTime(assignment.dueDate);
      if (
        Object.keys(assignment).length > 0 &&
        assignment.task &&
        Object.keys(assignment.task).length > 0 &&
        assignment.task.subTasks &&
        Object.keys(assignment.task.subTasks).length > 0
      )
        newsubtask();
    });
    studentSocket.on("get-new-answer", (sid, ans) => {
      if (sid === student.id) {
        alert(ans);
      }
    });
  }, [cid, newsubtask, student, studentJoinClass, studentSocket]);

  React.useEffect(() => {
    if (
      assignment &&
      Object.keys(assignment).length > 0 &&
      student !== null &&
      student !== undefined
    ) {
      checkExtraTimeRequest(student.id, assignment._id);
      handleSetAssignmentStatus(student.id, assignment._id, "In Progress");
    }
  }, [assignment, checkExtraTimeRequest, handleSetAssignmentStatus, student]);

  const sendstudentques = (sid, aid) => {
    const data = {
      studentid: sid,
      assignmentid: aid,
      question: askquestion,
    };
    axios
      .post(
        `http://localhost:5000/api/studentques/studentquestion`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        handleClose();
        studentSocket.emit("new-question", res.data.studentques, cid);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
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
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Loading...
          </Typography>
        </Box>
      ) : (
        <Box height="100vh">
          <Modal open={getModal} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",

                p: 4,
              }}
            >
              <Card sx={{ mx: "auto" }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      Any Queries related to assignment
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Write it here
                    </Typography>
                    <TextField
                      type="text"
                      onChange={(e) => setaskquestion(e.target.value)}
                    />

                    <Button
                      variant="contained"
                      sx={{ mt: 2, mb: 2 }}
                      color="error"
                      onClick={() =>
                        sendstudentques(student.id, assignment._id)
                      }
                    >
                      Ask
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Modal>
          <Typography
            variant="h4"
            sx={{ pt: 2, fontWeight: "bold", textAlign: "center" }}
          >
            Welcome {student.registrationNumber}
          </Typography>
          <Typography
            variant="h6"
            sx={{ pb: 2, fontWeight: "bold", textAlign: "center" }}
          >
            You have joined Class : {cid}
          </Typography>
          <Divider />
          {assignment && Object.keys(assignment).length > 0 ? (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "grey.500",
                      borderRadius: 1,
                      mt: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        pt: 2,
                        pb: 2,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Solve the Assignment : {assignment.task.name}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        onClick={() => setModal(true)}
                        size="small"
                        sx={{ m: 2 }}
                      >
                        <FaHandPaper size={30} />
                        <Typography sx={{ pl: 1 }}>Ask a Question</Typography>
                      </Button>
                    </Box>
                    <Divider />

                    <Box sx={{ m: 4 }}>
                      <Stack
                        direction="row"
                        spacing={50}
                        sx={{ m: 2 }}
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ pt: 2, pb: 2, fontWeight: "bold" }}
                        >
                          Question : {assignment.task.description}
                        </Typography>
                      </Stack>

                      <TextField
                        variant="outlined"
                        size="medium"
                        fullWidth
                        multiline
                        rows={3}
                        helperText={`${taskanswer.length}/255`}
                        placeholder="Write your answer here"
                        inputProps={{ maxLength: 255 }}
                        onChange={(e) => {
                          setTaskAnswer(e.target.value);
                          studentSocket.emit(
                            "typing",
                            student.id,
                            calcutation(),
                            cid
                          );
                        }}
                      />
                    </Box>
                    {assignment.task.subTasks &&
                      assignment.task.subTasks.length > 0 &&
                      assignment.task.subTasks.map((subtask, index) => {
                        return (
                          <Box sx={{ m: 4 }} key={index}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                pt: 2,
                                pb: 2,
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                            >
                              Sub Task : {subtask.name}
                            </Typography>

                            <Typography
                              variant="subtitle1"
                              sx={{ pt: 2, pb: 2, fontWeight: "bold" }}
                            >
                              Question : {subtask.description}
                            </Typography>
                            <TextField
                              variant="outlined"
                              size="medium"
                              fullWidth
                              multiline
                              rows={3}
                              inputProps={{ maxLength: 255 }}
                              helperText={`${subTasks[index].answer.length}/255`}
                              placeholder="Write your answer here"
                              onChange={(e) => {
                                handleSubTaskAnswer(index, e.target.value);
                                studentSocket.emit(
                                  "typing",
                                  student.id,
                                  // checks if task answer and subtask answer is not empty then create a percentage of typing
                                  calcutation(),
                                  cid
                                );
                              }}
                            />
                          </Box>
                        );
                      })}

                    <Box
                      sx={{ m: 4, display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleSetAssignmentStatus(
                            student.id,
                            assignment._id,
                            "Completed"
                          );
                          handleSubmitAssignment();
                        }}
                        disabled={diablebtn}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "grey.500",
                      borderRadius: 1,
                      mt: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ pt: 2, fontWeight: "bold", textAlign: "center" }}
                    >
                      Add Your Status
                    </Typography>
                    <Divider />
                    <Stack direction="row" spacing={2} sx={{ m: 2 }}>
                      <FormControl>
                        <RadioGroup
                          defaultValue="In Progress"
                          name="radio-buttons-group"
                        >
                          <FormControlLabel
                            value="In Progress"
                            control={<Radio />}
                            label="In Progress"
                            checked={assignmentStatus === "In Progress"}
                            onClick={() =>
                              handleSetAssignmentStatus(
                                student.id,
                                assignment._id,
                                "In Progress"
                              )
                            }
                          />
                          <FormControlLabel
                            value="Give Up"
                            control={<Radio />}
                            label="Give Up"
                            checked={assignmentStatus === "Give Up"}
                            onClick={() => {
                              handleSetAssignmentStatus(
                                student.id,
                                assignment._id,
                                "Give Up"
                              );
                            }}
                          />
                          <FormControlLabel
                            value="Completed"
                            control={<Radio />}
                            label="Completed"
                            checked={assignmentStatus === "Completed"}
                            onClick={() =>
                              handleSetAssignmentStatus(
                                student.id,
                                assignment._id,
                                "Completed"
                              )
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "grey.500",
                      borderRadius: 1,
                      mt: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        pt: 2,
                        pb: 2,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Timer
                    </Typography>
                    <Divider />
                    <Box sx={{ m: 2 }}>
                      <Countdown
                        date={dueTime}
                        renderer={renderer}
                        onComplete={() => {
                          setDisableRequestBtn(true);
                          setDiablebtn(true);
                        }}
                      />
                    </Box>
                    <Divider />
                    <Typography
                      variant="subtitle1"
                      sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}
                    >
                      Request for Time Extension!
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: "center" }}
                    >
                      You can request for time extension only once.
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ m: 2 }}
                      justifyContent="center"
                    >
                      <Button
                        variant="contained"
                        disabled={disableRequestBtn}
                        onClick={() =>
                          handleExtraTime(5, student.id, assignment._id)
                        }
                      >
                        + 5 min
                      </Button>
                      <Button
                        variant="contained"
                        disabled={disableRequestBtn}
                        onClick={() =>
                          handleExtraTime(10, student.id, assignment._id)
                        }
                      >
                        + 10 min
                      </Button>
                      <Button
                        variant="contained"
                        disabled={disableRequestBtn}
                        onClick={() =>
                          handleExtraTime(15, student.id, assignment._id)
                        }
                      >
                        + 15 min
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                No Assignment Found
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};
