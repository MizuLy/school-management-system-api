const express = require("express");
const { config } = require("dotenv");
const { connectDB, disconnectDB } = require("./config/db");
const cookieParser = require("cookie-parser"); // For cookie?
const logger = require("morgan");

const authRoute = require("./routes/auth.route");
const teacherRoute = require("./routes/teacher.route");
const guardianRoute = require("./routes/guardian.route");
const studentRoute = require("./routes/student.route");
const registerTokenRoute = require("./routes/registerToken.route");
const eventRoute = require("./routes/event.route");
const classRoute = require("./routes/class.route");
const courseRoute = require("./routes/course.route");
const enrollRoute = require("./routes/classStudent.route");
const assignmentRoute = require("./routes/assignment.route");

config();
connectDB();

const app = express();
const PORT = process.env.PORT || 6969;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger("dev"));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoute);
app.use("/api/register", registerTokenRoute);
app.use("/api/teachers", teacherRoute);
app.use("/api/guardians", guardianRoute);
app.use("/api/students", studentRoute);
app.use("/api/events", eventRoute);
app.use("/api/classes", classRoute);
app.use("/api/courses", courseRoute);
app.use("/api/enroll", enrollRoute);
app.use("/api/assignments", assignmentRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
