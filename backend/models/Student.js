const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"]
    },

    enrollmentNo: {
      type: String,
      required: [true, "Enrollment number is required"],
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,

      // Correct email validation
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email"
      ]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false
    },

    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true
    },

    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 10
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: 10,
      minlength: 10
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },

  {
    timestamps: true
  }
);


// ========================================
// PASSWORD HASHING
// ========================================

studentSchema.pre("save", async function () {

  // Password change nahi hua
  // to dobara hash nahi karna
  if (!this.isModified("password")) {
    return;
  }

  // Password hash
  this.password = await bcrypt.hash(
    this.password,
    10
  );
});


module.exports = mongoose.model(
  "Student",
  studentSchema
);