const Student = require("../models/Student");
const bcrypt = require("bcryptjs");


// ===============================
// STUDENT REGISTER
// ===============================
const studentRegister = async (req, res) => {
  try {
    console.log("=================================");
    console.log("STUDENT REGISTER API CALLED");
    console.log("REQUEST BODY:", req.body);
    console.log("=================================");

    const {
      name,
      enrollmentNo,
      email,
      password,
      course,
      semester,
      phone
    } = req.body;

    // Required fields
    if (
      !name ||
      !enrollmentNo ||
      !email ||
      !password ||
      !course ||
      !semester ||
      !phone
    ) {
      return res.status(400).json({
        message: "All student fields are required"
      });
    }

    const cleanName = name.trim();
    const cleanEnrollmentNo = enrollmentNo.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Name validation
    if (cleanName.length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters"
      });
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address"
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    // Phone validation
    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits"
      });
    }

    // Check duplicate enrollment/email
    const existingStudent = await Student.findOne({
      $or: [
        { enrollmentNo: cleanEnrollmentNo },
        { email: cleanEmail }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({
        message:
          "Student with this enrollment number or email already exists"
      });
    }

    // Create student
    const student = await Student.create({
      name: cleanName,
      enrollmentNo: cleanEnrollmentNo,
      email: cleanEmail,
      password,
      course,
      semester: Number(semester),
      phone: cleanPhone,
      status: "Active"
    });

    console.log("STUDENT CREATED:", student.email);

    return res.status(201).json({
      message: "Student registration successful. You can now login.",
      student: {
        _id: student._id,
        name: student.name,
        enrollmentNo: student.enrollmentNo,
        email: student.email,
        course: student.course,
        semester: student.semester,
        phone: student.phone,
        status: student.status
      }
    });

  } catch (error) {
    console.error("STUDENT REGISTER ERROR:", error);

    // Duplicate MongoDB error
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "Enrollment number or email already exists"
      });
    }

    return res.status(500).json({
      message:
        error.message || "Student registration failed"
    });
  }
};


// ===============================
// STUDENT LOGIN
// ===============================
const studentLogin = async (req, res) => {
  try {
    console.log("=================================");
    console.log("STUDENT LOGIN API CALLED");
    console.log("LOGIN ENROLLMENT:", req.body?.enrollmentNo);
    console.log("=================================");

    const { enrollmentNo, password } = req.body;

    if (!enrollmentNo || !password) {
      return res.status(400).json({
        message:
          "Enrollment number and password are required"
      });
    }

    const cleanEnrollmentNo = enrollmentNo.trim();

    // Find student
    const student = await Student.findOne({
      enrollmentNo: cleanEnrollmentNo
    }).select("+password");

    if (!student) {
      return res.status(401).json({
        message:
          "Invalid enrollment number or password"
      });
    }

    // Check active/inactive
    if (student.status === "Inactive") {
      return res.status(403).json({
        message:
          "Your library account is inactive. Please contact the administrator."
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      student.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message:
          "Invalid enrollment number or password"
      });
    }

    console.log(
      "STUDENT LOGIN SUCCESS:",
      student.enrollmentNo
    );

    return res.status(200).json({
      message: "Student login successful",

      role: "student",

      student: {
        _id: student._id,
        name: student.name,
        enrollmentNo: student.enrollmentNo,
        email: student.email,
        course: student.course,
        semester: student.semester,
        phone: student.phone,
        status: student.status
      }
    });

  } catch (error) {
    console.error("STUDENT LOGIN ERROR:", error);

    return res.status(500).json({
      message:
        error.message || "Student login failed"
    });
  }
};


module.exports = {
  studentRegister,
  studentLogin
};