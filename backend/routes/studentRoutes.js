const express = require("express");

const router = express.Router();

const {
  getStudents,
  createStudent,
  updateStudentStatus,
  updateStudent,
  deleteStudent,
  getStudentCount
} = require("../controllers/studentController");

console.log("STUDENT ROUTES LOADED");

router.get("/", getStudents);

router.post("/", createStudent);

router.put("/:id", updateStudent);

router.patch("/:id/status", updateStudentStatus);

router.delete("/:id", deleteStudent);

router.get("/count", getStudentCount);

module.exports = router;