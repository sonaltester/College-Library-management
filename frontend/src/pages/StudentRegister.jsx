import { useState } from "react";
import axios from "axios";

function StudentRegister({ setPage }) {
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    course: "",
    semester: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Course wise semester
  const courseSemesters = {
    MBA: 4,
    BBA: 6,
    BCA: 6,
    MCA: 4,
    IMCA: 10,
    "B.Tech": 8,
    "B.Sc IT": 6,
    "M.Sc IT": 4,
    "B.Com": 6,
    "M.Com": 4
  };

  const courses = [
    "MBA",
    "BBA",
    "BCA",
    "MCA",
    "IMCA",
    "B.Tech",
    "B.Sc IT",
    "M.Sc IT",
    "B.Com",
    "M.Com"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "course") {
      setFormData({
        ...formData,
        course: value,
        semester: ""
      });

      setError("");
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.name.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!formData.enrollmentNo.trim()) {
      setError("Please enter your enrollment number");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.course) {
      setError("Please select your course");
      return;
    }

    if (!formData.semester) {
      setError("Please select your semester");
      return;
    }

    if (!formData.phone) {
      setError("Please enter your phone number");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.confirmPassword) {
      setError("Please confirm your password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      console.log("STUDENT REGISTER REQUEST:", {
        name: formData.name,
        enrollmentNo: formData.enrollmentNo,
        email: formData.email,
        course: formData.course,
        semester: Number(formData.semester),
        phone: formData.phone
      });

      // STUDENT REGISTER API
      const response = await axios.post(
        "http://localhost:5000/api/student-auth/register",
        {
          name: formData.name.trim(),
          enrollmentNo: formData.enrollmentNo.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          course: formData.course,
          semester: Number(formData.semester),
          phone: formData.phone.trim()
        }
      );

      console.log(
        "STUDENT REGISTER RESPONSE:",
        response.data
      );

      setSuccess(
        response.data.message ||
          "Registration successful! Please login."
      );

      // Clear form after successful registration
      setFormData({
        name: "",
        enrollmentNo: "",
        email: "",
        password: "",
        confirmPassword: "",
        course: "",
        semester: "",
        phone: ""
      });

      // Go to student login
      setTimeout(() => {
        setPage("student-login");
      }, 1500);

    } catch (error) {
      console.error(
        "STUDENT REGISTER ERROR:",
        error
      );

      console.error(
        "BACKEND ERROR:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const totalSemesters =
    courseSemesters[formData.course] || 0;

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #2563eb 100%)"
      }}
    >
      <div
        className="card border-0 shadow-lg overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "850px",
          borderRadius: "20px"
        }}
      >

        {/* HEADER */}
        <div
          className="text-white text-center p-4 p-md-5"
          style={{
            background:
              "linear-gradient(135deg, #172554 0%, #1d4ed8 100%)"
          }}
        >

          {/* SVGU LOGO */}
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{
              width: "100px",
              height: "100px",
              background: "#ffffff",
              borderRadius: "20px",
              padding: "8px"
            }}
          >
            <img
              src="/svgu-logo.png"
              alt="SVGU Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
          </div>

          <h2 className="fw-bold mb-1">
            SVGU Student Portal
          </h2>

          <p
            className="mb-1"
            style={{ color: "#dbeafe" }}
          >
            Library Management System
          </p>

          <small style={{ color: "#bfdbfe" }}>
            Student Registration
          </small>
        </div>

        {/* FORM */}
        <div className="bg-white p-4 p-md-5">

          <div className="mb-4">
            <h3 className="fw-bold mb-1">
              Create Student Account
            </h3>

            <p className="text-muted mb-0">
              Register using your SVGU student details
              to access the library portal.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="alert alert-danger border-0"
              role="alert"
            >
              <strong>
                Registration Error
              </strong>

              <div className="mt-1">
                {error}
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div
              className="alert alert-success border-0"
              role="alert"
            >
              <strong>
                Registration Successful
              </strong>

              <div className="mt-1">
                {success}
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            autoComplete="off"
          >

            {/* STUDENT INFORMATION */}
            <h6 className="fw-bold text-primary mb-3">
              Student Information
            </h6>

            <div className="row">

              {/* NAME */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control py-2"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>

              {/* ENROLLMENT */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Enrollment Number
                </label>

                <input
                  type="text"
                  name="enrollmentNo"
                  className="form-control py-2"
                  placeholder="Enter enrollment number"
                  value={formData.enrollmentNo}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>

            </div>

            {/* EMAIL */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Email Address
              </label>

              <input
                type="email"
                name="studentEmail"
                id="student-registration-email"
                className="form-control py-2"
                placeholder="Enter your university email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    email: e.target.value
                  });
                  setError("");
                }}
                autoComplete="new-password"
                spellCheck="false"
                required
              />
            </div>

            {/* COURSE + SEMESTER */}
            <div className="row">

              {/* COURSE */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Course
                </label>

                <select
                  name="course"
                  className="form-select py-2"
                  value={formData.course}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                >
                  <option value="">
                    Select your course
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course}
                      value={course}
                    >
                      {course}
                    </option>
                  ))}
                </select>

                {formData.course && (
                  <small className="text-muted">
                    {totalSemesters} semesters
                  </small>
                )}
              </div>

              {/* SEMESTER */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Semester
                </label>

                <select
                  name="semester"
                  className="form-select py-2"
                  value={formData.semester}
                  onChange={handleChange}
                  disabled={!formData.course}
                  autoComplete="off"
                  required
                >
                  <option value="">
                    {formData.course
                      ? "Select semester"
                      : "Select course first"}
                  </option>

                  {Array.from(
                    { length: totalSemesters },
                    (_, index) => index + 1
                  ).map((semester) => (
                    <option
                      key={semester}
                      value={semester}
                    >
                      Semester {semester}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* PHONE */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                className="form-control py-2"
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                pattern="[0-9]{10}"
                autoComplete="off"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Password
              </label>

              <div className="input-group">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="studentNewPassword"
                  id="student-registration-password"
                  className="form-control py-2"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      password: e.target.value
                    });
                    setError("");
                  }}
                  autoComplete="new-password"
                  minLength="6"
                  required
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              <small className="text-muted">
                Password must be at least 6 characters.
              </small>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Confirm Password
              </label>

              <div className="input-group">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="studentConfirmPassword"
                  id="student-registration-confirm-password"
                  className="form-control py-2"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value
                    });
                    setError("");
                  }}
                  autoComplete="new-password"
                  minLength="6"
                  required
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>
            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="btn w-100 py-2 fw-semibold text-white"
              disabled={loading}
              style={{
                background:
                  "linear-gradient(90deg, #0b3d91, #2563c7)",
                border: "none",
                borderRadius: "8px"
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                  ></span>

                  Creating Account...
                </>
              ) : (
                "Create Student Account"
              )}
            </button>

          </form>

          {/* LOGIN */}
          <div className="text-center mt-4">

            <span className="text-muted">
              Already registered?
            </span>

            <button
              type="button"
              className="btn btn-link fw-semibold text-decoration-none ms-1"
              onClick={() =>
                setPage("student-login")
              }
            >
              Login here
            </button>

          </div>

          {/* BACK */}
          <div className="text-center mt-2">

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() =>
                setPage("role-selection")
              }
            >
              Back to Portal Selection
            </button>

          </div>

          {/* UNIVERSITY */}
          <div className="text-center mt-4">
            <small className="text-muted">
              Sardar Vallabhbhai Global University
            </small>
          </div>

        </div>
      </div>
    </div>
  );
}

export default StudentRegister;