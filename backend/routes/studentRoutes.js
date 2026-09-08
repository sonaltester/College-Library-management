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

// ==========================================
// STUDENT MANAGEMENT ROUTES
// ==========================================

// GET all students
router.get("/", getStudents);

// GET total student count
// IMPORTANT: keep this before /:id
router.get("/count", getStudentCount);

// CREATE student
// Existing functionality preserved
router.post("/", createStudent);

// UPDATE student
router.put("/:id", updateStudent);

// UPDATE student status
router.patch("/:id/status", updateStudentStatus);

// DELETE student
router.delete("/:id", deleteStudent);

module.exports = router;