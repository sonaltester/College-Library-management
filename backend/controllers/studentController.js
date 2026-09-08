const Student = require("../models/Student");
const Issue = require("../models/Issue");

// ==========================================
// GET ALL STUDENTS
// ==========================================

const getStudents = async (req, res) => {
  try {
    // Get currently issued books student-wise
    const issues = await Issue.aggregate([
      {
        $match: {
          status: "Issued"
        }
      },
      {
        $group: {
          _id: "$student",
          booksIssued: {
            $sum: 1
          }
        }
      }
    ]);

    // Create student ID -> books count map
    const issueCountMap = new Map(
      issues.map((item) => [
        String(item._id),
        item.booksIssued
      ])
    );

    // Get all students
    const students = await Student.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // Add booksIssued to every student
    const studentsWithBooks = students.map((student) => ({
      ...student,
      booksIssued:
        issueCountMap.get(String(student._id)) || 0
    }));

    res.status(200).json(studentsWithBooks);

  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);

    res.status(500).json({
      message:
        error.message || "Unable to fetch students"
    });
  }
};

// ==========================================
// CREATE STUDENT
// ==========================================

// This route is kept for existing functionality.
// Student registration/login is handled separately
// by studentAuthController.js.

const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);

    const studentResponse = student.toObject();

    delete studentResponse.password;

    res.status(201).json(studentResponse);

  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "Enrollment number or email already exists"
      });
    }

    res.status(400).json({
      message:
        error.message || "Unable to create student"
    });
  }
};

// ==========================================
// UPDATE STUDENT
// ==========================================

const updateStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      course,
      semester,
      phone,
      status
    } = req.body;

    if (
      !name ||
      !email ||
      !course ||
      !semester ||
      !phone
    ) {
      return res.status(400).json({
        message:
          "Name, email, course, semester and phone are required"
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Validate name
    if (cleanName.length < 2) {
      return res.status(400).json({
        message:
          "Name must be at least 2 characters"
      });
    }

    // Validate email
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return res.status(400).json({
        message:
          "Please enter a valid email address"
      });
    }

    // Validate phone
    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        message:
          "Phone number must be exactly 10 digits"
      });
    }

    // Validate semester
    const semesterNumber = Number(semester);

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 10
    ) {
      return res.status(400).json({
        message:
          "Semester must be between 1 and 10"
      });
    }

    // Validate status
    if (
      status &&
      status !== "Active" &&
      status !== "Inactive"
    ) {
      return res.status(400).json({
        message:
          "Status must be Active or Inactive"
      });
    }

    // Do NOT allow enrollmentNo/password
    // to be changed from admin edit.

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: cleanName,
        email: cleanEmail,
        course: course.trim(),
        semester: semesterNumber,
        phone: cleanPhone,
        ...(status ? { status } : {})
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student
    });

  } catch (error) {
    console.error("UPDATE STUDENT ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    res.status(400).json({
      message:
        error.message || "Unable to update student"
    });
  }
};

// ==========================================
// UPDATE STUDENT STATUS
// ==========================================

const updateStudentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (
      status !== "Active" &&
      status !== "Inactive"
    ) {
      return res.status(400).json({
        message:
          "Status must be Active or Inactive"
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message:
        `Student account is now ${status}`,
      student
    });

  } catch (error) {
    console.error(
      "UPDATE STUDENT STATUS ERROR:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Unable to update student status"
    });
  }
};

// ==========================================
// DELETE STUDENT
// ==========================================

const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(
      studentId
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    // Delete related issue records first
    await Issue.deleteMany({
      student: studentId
    });

    await Student.findByIdAndDelete(studentId);

    res.status(200).json({
      message:
        "Student and related issue records deleted successfully"
    });

  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);

    res.status(500).json({
      message:
        error.message ||
        "Unable to delete student"
    });
  }
};

// ==========================================
// GET STUDENT COUNT
// ==========================================

const getStudentCount = async (req, res) => {
  try {
    const count =
      await Student.countDocuments();

    res.status(200).json({
      count
    });

  } catch (error) {
    console.error(
      "GET STUDENT COUNT ERROR:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Unable to get student count"
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  updateStudentStatus,
  deleteStudent,
  getStudentCount
};