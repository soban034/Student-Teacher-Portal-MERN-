const dotenv = require("dotenv").config();
const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Routes import
const teacherRoutes = require("./routes/teacher");
const studentRoutes = require("./routes/student");
const adminRoutes = require("./routes/admin");
const studentquesRoutes = require("./routes/studentques");
// Connect to Mongoose
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    process.env.NODE_ENV === "development" &&
      console.log("Successfully connected to the Database");
  })
  .catch((err) => console.log(err));

// APP
const app = express();
// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io
const server = require("http").createServer(app);
const socketIO = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
socketIO.of("/api/socket").on("connection", (socket) => {
  console.log("socket.io: User connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("socket.io: User disconnected: ", socket.id);
  });

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log("socket.io: User joined room: ", roomId);
  });

  socket.on("student-join", (student, roomId) => {
    socket.to(roomId).emit("student-joined", student);
    console.log("socket.io: Student joined room: ", roomId + " ", student);
  });

  socket.on("new-assignment", (assignment, roomId) => {
    socket.to(roomId).emit("get-new-assignment", assignment);
    console.log(
      "socket.io: New assignment in room: ",
      roomId + " ",
      assignment
    );
  });

  socket.on("new-submission", (submission, roomId) => {
    socket.to(roomId).emit("get-new-submission", submission);
    console.log(
      "socket.io: New submission in room: ",
      roomId + " ",
      submission
    );
  });
  socket.on("send-message", (message, roomId) => {
    socket.to(roomId).emit("receive-message", message);
    console.log("socket.io: User sent message: ", message);
  });

  socket.on("request-extra-time", (time, roomId) => {
    socket.to(roomId).emit("get-extra-time", time);
    console.log("socket.io: User sent extra time: ", time);
  });

  socket.on("dueTime-updated", (time, roomId) => {
    socket.to(roomId).emit("get-dueTime-updated", time);
    console.log("socket.io: User updated dueTime: ", time);
  });

  socket.on("post-status", (status, roomId) => {
    socket.to(roomId).emit("student-status", status);
    console.log("socket.io: User posted status: ", status);
  });

  socket.on("typing", (studentid, progress, roomId) => {
    socket.to(roomId).emit("student-typing", studentid, progress);
    console.log(
      "socket.io: Student typing in room: ",
      roomId + " ",
      studentid,
      progress
    );
  });

  socket.on("new-question", (ques, roomId) => {
    socket.to(roomId).emit("get-new-question", ques);
    console.log("socket.io: New question in room: ", roomId + " ", ques);
  });

  socket.on("new-answer", (sid, ans, roomId) => {
    socket.to(roomId).emit("get-new-answer", sid, ans);
    console.log("socket.io: New answer in room: ", roomId + " ", ans);
  });
});

// Routes
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/studentques", studentquesRoutes);

//PORT
const PORT = process.env.PORT || 6000;

// Listen
server.listen(PORT, () => {
  process.env.NODE_ENV === "development" &&
    console.log(`Server running on Port :${PORT}`);
});
