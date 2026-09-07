const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");


// ========================================
// ROUTES
// ========================================

const bookRoutes = require("./routes/bookRoutes");
const studentRoutes = require("./routes/studentRoutes");
const studentAuthRoutes = require("./routes/studentAuthRoutes");
const issueRoutes = require("./routes/issueRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


// ========================================
// DATABASE
// ========================================

connectDB();


// ========================================
// EXPRESS APP
// ========================================

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());


// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {

  res.json({
    message:
      "College Library Management System API is running"
  });

});


// ========================================
// API ROUTES
// ========================================

app.use(
  "/api/books",
  bookRoutes
);

app.use(
  "/api/students",
  studentRoutes
);


// ========================================
// STUDENT AUTH
// ========================================

app.use(
  "/api/student-auth",
  studentAuthRoutes
);


// ========================================
// ADMIN AUTH
// ========================================

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/issues",
  issueRoutes
);


app.use(
  "/api/dashboard",
  dashboardRoutes
);


// ========================================
// PORT
// ========================================

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

  console.log(
    `Server running on http://localhost:${PORT}`
  );

});