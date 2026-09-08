import { useState } from "react"
import axios from "axios"

function StudentLogin({ setRole, setPage }) {
  const [formData, setFormData] = useState({
    enrollmentNo: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Prevent browser autofill
  const [enrollmentFocused, setEnrollmentFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })

    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")

    if (!formData.enrollmentNo || !formData.password) {
      setError("Please enter enrollment number and password.")
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        "http://localhost:5000/api/student-auth/login",
        {
          enrollmentNo: formData.enrollmentNo,
          password: formData.password
        }
      )

      const data = response.data

      if (!data.student) {
        setError("Student login failed.")
        return
      }

      // Save student information
      const student = data.student

      localStorage.setItem(
        "student",
        JSON.stringify({
          ...student,
          enrollmentNo:
            student.enrollmentNo ||
            student.enrollmentNumber ||
            student.enrollment ||
            formData.enrollmentNo ||
            ""
        })
      )

      localStorage.setItem("role", "student")

      // Student dashboard
      setRole("student")
      setPage("student-dashboard")

    } catch (error) {
      console.error("Student Login Error:", error)

      setError(
        error.response?.data?.message ||
          "Invalid enrollment number or password."
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0f2fe 100%)",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "950px",
          minHeight: "560px",
          background: "#ffffff",
          borderRadius: "22px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          display: "flex"
        }}
      >

        {/* ==========================================
            LEFT SIDE
        ========================================== */}

        <div
          style={{
            flex: 1,
            background:
              "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)",
            color: "#ffffff",
            padding: "55px 45px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >

          {/* SVGU LOGO */}

          <div
            style={{
              width: "90px",
              height: "90px",
              background: "#ffffff",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              padding: "10px",
              boxSizing: "border-box"
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

          <h1
            style={{
              fontSize: "36px",
              margin: "0 0 15px",
              fontWeight: "700"
            }}
          >
            Student Portal
          </h1>

          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.7",
              opacity: "0.92",
              margin: 0
            }}
          >
            Welcome to the College Library Management System.
            <br />
            Login to access your library account, books and issued books.
          </p>

          <div
            style={{
              marginTop: "35px",
              padding: "18px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.12)",
              fontSize: "14px",
              lineHeight: "1.6"
            }}
          >
            <strong>Student Features</strong>

            <div style={{ marginTop: "10px" }}>
              ✓ View available books
              <br />
              ✓ View issued books
              <br />
              ✓ Check due dates
              <br />
              ✓ View profile
            </div>
          </div>

        </div>

        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <div
          style={{
            flex: 1,
            padding: "55px 50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >

          <div
            style={{
              maxWidth: "400px",
              width: "100%",
              margin: "0 auto"
            }}
          >

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "30px",
                color: "#111827"
              }}
            >
              Student Login
            </h2>

            <p
              style={{
                margin: "0 0 30px",
                color: "#6b7280",
                fontSize: "15px"
              }}
            >
              Login using your enrollment number
            </p>

            {/* ERROR */}

            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  border: "1px solid #fecaca",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "14px"
                }}
              >
                {error}
              </div>
            )}

            {/* LOGIN FORM */}

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
            >

              {/* ==========================================
                  ENROLLMENT NUMBER
              ========================================== */}

              <div style={{ marginBottom: "20px" }}>

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "14px"
                  }}
                >
                  Enrollment Number
                </label>

                <input
                  type="text"
                  name="studentEnrollment"
                  id="student-login-enrollment"
                  value={formData.enrollmentNo}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      enrollmentNo: e.target.value
                    })
                    setError("")
                  }}
                  placeholder="Enter enrollment number"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  readOnly={!enrollmentFocused}
                  onFocus={() => setEnrollmentFocused(true)}
                  style={{
                    width: "100%",
                    padding: "13px 14px",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    outline: "none",
                    fontSize: "15px",
                    boxSizing: "border-box",
                    background: "#ffffff"
                  }}
                />

              </div>

              {/* ==========================================
                  PASSWORD
              ========================================== */}

              <div style={{ marginBottom: "25px" }}>

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "14px"
                  }}
                >
                  Password
                </label>

                <div
                  style={{
                    position: "relative"
                  }}
                >

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="studentLoginPassword"
                    id="student-login-password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        password: e.target.value
                      })
                      setError("")
                    }}
                    placeholder="Enter password"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    readOnly={!passwordFocused}
                    onFocus={() => setPasswordFocused(true)}
                    style={{
                      width: "100%",
                      padding: "13px 50px 13px 14px",
                      border: "1px solid #d1d5db",
                      borderRadius: "10px",
                      outline: "none",
                      fontSize: "15px",
                      boxSizing: "border-box",
                      background: "#ffffff"
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "18px"
                    }}
                  >
                    {showPassword
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>

              </div>

              {/* ==========================================
                  LOGIN BUTTON
              ========================================== */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "10px",
                  background:
                    loading
                      ? "#93c5fd"
                      : "#2563eb",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor:
                    loading
                      ? "not-allowed"
                      : "pointer",
                  transition: "0.2s"
                }}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>

            {/* ==========================================
                REGISTER
            ========================================== */}

            <div
              style={{
                textAlign: "center",
                marginTop: "25px",
                fontSize: "14px",
                color: "#6b7280"
              }}
            >

              Don't have an account?{" "}

              <button
                type="button"
                onClick={() =>
                  setPage("student-register")
                }
                style={{
                  border: "none",
                  background: "none",
                  color: "#2563eb",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "14px"
                }}
              >
                Register here
              </button>

            </div>

            {/* ==========================================
                BACK
            ========================================== */}

            <div
              style={{
                textAlign: "center",
                marginTop: "15px"
              }}
            >

              <button
                type="button"
                onClick={() =>
                  setPage("role-selection")
                }
                style={{
                  border: "none",
                  background: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                ← Back to Role Selection
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default StudentLogin