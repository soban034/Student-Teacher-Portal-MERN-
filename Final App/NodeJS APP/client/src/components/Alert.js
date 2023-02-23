import React from "react";
import { Snackbar, Alert as MuiAlert } from "@mui/material";

export const Alert = (open, severity, message) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    return !open;
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
