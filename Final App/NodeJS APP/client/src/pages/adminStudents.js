import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Divider, Stack, Grid, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const AdminStudents = () => {
  const [allstudents, setAllStudents] = useState([]);

  const [file, setFile] = useState();
  const [array, setArray] = useState([]);

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i) => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
      console.log(array);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));

  const getAllStudents = () => {
    axios
      .get("http://localhost:5000/api/admin/getstudents")
      .then((res) => {
        console.log(res);
        setAllStudents(res.data.students);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveAllStudents = () => {
    const temparray = array.map((i) => {
      return {
        registrationNumber: i[headerKeys[0]],
        name: `${i[headerKeys[1]]} ${i[headerKeys[2]]}`,
      };
    });

    axios
      .post(
        "http://localhost:5000/api/admin/savestudents",
        JSON.stringify({ students: temparray }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        getAllStudents();
        setArray([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  return (
    <Box height="100vh">
      <Typography
        variant="h4"
        sx={{ pt: 4, pb: 4, fontWeight: "bold", textAlign: "center" }}
      >
        All Students
      </Typography>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" sx={{ m: 2 }}>
          <input type={"file"} accept={".csv"} onChange={handleOnChange} />
        </Button>
        <Button
          variant="contained"
          sx={{ m: 2 }}
          onClick={(e) => handleOnSubmit(e)}
        >
          Import Student CSV
        </Button>
        <Button
          variant="contained"
          sx={{ m: 2 }}
          onClick={(e) => saveAllStudents(e)}
        >
          Save Students To Database
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Stack
              spacing={2}
              sx={{ p: 2 }}
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Students From Database
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        Student Registration Number
                      </TableCell>
                      <TableCell align="center">Student Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allstudents.length > 0 ? (
                      allstudents.map((row) => (
                        <TableRow
                          key={row._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">
                            {row.registrationNumber}
                          </TableCell>
                          <TableCell align="center">{row.name}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell align="center" colSpan={2}>
                          No Students Found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack
              spacing={2}
              sx={{ p: 2 }}
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Students From File
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        Student Registration Number
                      </TableCell>
                      <TableCell align="center">Student Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {array.length > 0 ? (
                      array.map((row) => (
                        <TableRow
                          key={row[headerKeys[0]]}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">
                            {row[headerKeys[0]]}
                          </TableCell>
                          <TableCell align="center">
                            {row[headerKeys[1]]} {row[headerKeys[2]]}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell align="center" colSpan={2}>
                          Import CSV File
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
