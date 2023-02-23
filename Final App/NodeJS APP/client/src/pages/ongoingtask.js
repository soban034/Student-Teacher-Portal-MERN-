import React from "react";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Divider,
  Stack,
  Grid,
  Button,
  Typography,
} from "@mui/material";

export const OngoingTask = () => {
  const [subTasks, setSubTasks] = React.useState([]);
  return (
    <Box height="100vh">
      <Typography
        variant="h4"
        sx={{ pt: 4, pb: 4, fontWeight: "bold", textAlign: "center" }}
      >
        Assignment
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
            <TextField />
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Assignment Description
            </Typography>
            <TextField />
          </Stack>
          {subTasks.map((subTask) => (
            <React.Fragment key={subTask.id}>
              <Stack spacing={2}>
                <Typography as="b" textAlign="center">
                  Sub Task {subTask.id}
                </Typography>
                <Typography as="b">Task Name</Typography>
                <TextField />
                <Typography as="b">Task Description</Typography>
                <TextField />
              </Stack>
            </React.Fragment>
          ))}

          <Divider />
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
              Assignment Deadline
            </Typography>
            <TextField type="date" />
            <TextField type="time" />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
