import React, { useEffect, useState } from "react";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  minHeight: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export const AdminClass = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [aid, setAid] = useState(0);
  const [tid, setTid] = useState(0);
  const handleOpen = (aindex, tindex) => {
    setAid(aindex);
    setTid(tindex);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const getAllAssignments = () => {
    axios
      .get("http://localhost:5000/api/admin/getAllAssignments")
      .then((res) => {
        console.log(res);
        setAssignments(res.data.assignments);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllAssignments();
  }, []);

  return (
    <Box height="100vh">
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box sx={{ justifyContent: "center", overflow: "auto" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
            >
              Students Enrolled
            </Typography>
            <Divider />
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Student Id</TableCell>
                    <TableCell align="center">Student Registration</TableCell>
                    <TableCell align="center">Student Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments &&
                    assignments.length > 0 &&
                    assignments[aid].students.map((student, index) => (
                      <TableRow
                        key={student._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{student._id}</TableCell>
                        <TableCell align="center">
                          {student.registrationNumber}
                        </TableCell>
                        <TableCell align="center">{student.name}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Modal>

      <Typography
        variant="h4"
        sx={{ pt: 4, pb: 4, fontWeight: "bold", textAlign: "center" }}
      >
        All Classes
      </Typography>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          sx={{ width: 200, m: 2 }}
          onClick={() => navigate("/admin/student")}
        >
          Add Students
        </Button>
      </Box>
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
                  <TableCell align="center">Class Id</TableCell>
                  <TableCell align="center">Class Name</TableCell>
                  <TableCell align="center">Teacher Name</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment, aidx) => (
                  <TableRow
                    key={assignment._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{assignment._id}</TableCell>
                    <TableCell align="center">{assignment.name}</TableCell>
                    <TableCell align="center">
                      {assignment.teacherid.name}
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Button
                          variant="contained"
                          sx={{ width: 200 }}
                          onClick={() => handleOpen(aidx, 0)}
                        >
                          Students Enrolled
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ width: 200 }}
                          onClick={() =>
                            navigate(`/admin/class/${assignment._id}`)
                          }
                        >
                          View All Tasks
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    </Box>
  );
};
