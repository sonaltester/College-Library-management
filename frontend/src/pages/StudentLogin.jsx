import { useState } from "react"
import axios from "axios"

function StudentLogin({ setRole, setPage }) {

  const [formData, setFormData] = useState({
    enrollmentNo: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Password show / hide
  const [showPassword, setShowPassword] = useState(false)


  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }


  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError("")

    try {

      setLoading(true)

      const response = await axios.post(
        "http://localhost:5000/api/student-auth/login",
        {
          enrollmentNo: formData.enrollmentNo.trim(),
          password: formData.password
        }
      )

      const data = response.data


      // Save student

      if (data.student) {

        localStorage.setItem(
          "student",
          JSON.stringify(data.student)
        )

      }


      // Save role

      localStorage.setItem(
        "role",
        "student"
      )


      // Save token if available

      if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        )

      }


      // Reset password visibility

      setShowPassword(false)


      // Go to student dashboard

      setRole("student")

      setPage("student-dashboard")


    } catch (error) {

      console.error(
        "Student Login Error:",
        error
      )

      setError(
        error.response?.data?.message ||
        "Invalid enrollment number or password. Please try again."
      )

    } finally {

      setLoading(false)

    }

  }


  return (

    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0f2fe 100%)"
      }}
    >

      <div
        className="card border-0 shadow-lg overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "1020px",
          borderRadius: "22px"
        }}
      >

        <div className="row g-0">


          {/* ========================= */}
          {/* LEFT SIDE */}
          {/* ========================= */}

          <div
            className="col-md-6 text-white p-5 d-flex flex-column justify-content-center"
            style={{
              background:
                "linear-gradient(160deg, #2563eb, #1d4ed8, #1e40af)"
            }}
          >

            {/* SVGU LOGO */}

            <div className="mb-4">

              <img
                src="/svgu-logo.png"
                alt="SVGU Logo"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  background: "#ffffff",
                  borderRadius: "18px",
                  padding: "12px"
                }}
              />

            </div>


            <h2 className="fw-bold mb-3">
              Student Portal
            </h2>


            <p
              className="mb-4"
              style={{
                color: "#eff6ff",
                lineHeight: "1.8",
                fontSize: "17px"
              }}
            >

              Welcome to the College Library Management
              System.

              <br />

              Login to access your library account,
              books and issued books.

            </p>


            {/* STUDENT FEATURES */}

            <div
              className="p-3"
              style={{
                background:
                  "rgba(255,255,255,0.12)",
                borderRadius: "15px"
              }}
            >

              <div className="fw-semibold mb-3">
                Student Features
              </div>


              <div className="mb-2">
                ✓ View available books
              </div>


              <div className="mb-2">
                ✓ View issued books
              </div>


              <div className="mb-2">
                ✓ Check due dates
              </div>


              <div>
                ✓ View profile
              </div>

            </div>

          </div>


          {/* ========================= */}
          {/* RIGHT SIDE */}
          {/* ========================= */}

          <div
            className="col-md-6 bg-white p-4 p-md-5 d-flex flex-column justify-content-center"
          >

            {/* HEADER */}

            <div className="mb-4">

              <h2 className="fw-bold mb-2">
                Student Login
              </h2>

              <p className="text-muted mb-0">
                Login using your enrollment number
              </p>

            </div>


            {/* ERROR */}

            {error && (

              <div
                className="alert alert-danger border-0"
                role="alert"
              >

                <i className="bi bi-exclamation-circle me-2"></i>

                {error}

              </div>

            )}


            <form
              onSubmit={handleSubmit}
              autoComplete="off"
            >


              {/* ========================= */}
              {/* ENROLLMENT NUMBER */}
              {/* ========================= */}

              <div className="mb-3">

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


              {/* ========================= */}
              {/* PASSWORD */}
              {/* ========================= */}

              <div className="mb-4">

                <label className="form-label fw-semibold">
                  Password
                </label>


                {/* SAME EYE BUTTON AS ADMIN LOGIN */}

                <div className="input-group">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    className="form-control py-2"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />


                  {/* EYE BUTTON */}

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >

                    <i
                      className={
                        showPassword
                          ? "bi bi-eye-slash"
                          : "bi bi-eye"
                      }
                    ></i>

                  </button>

                </div>

              </div>


              {/* ========================= */}
              {/* LOGIN BUTTON */}
              {/* ========================= */}

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loading}
              >

                {loading ? (

                  <>

                    <span className="spinner-border spinner-border-sm me-2"></span>

                    Signing in...

                  </>

                ) : (

                  <>
                    Login
                  </>

                )}

              </button>

            </form>


            {/* ========================= */}
            {/* REGISTER */}
            {/* ========================= */}

            <div className="text-center mt-4">

              <span className="text-muted">
                Don't have an account?
              </span>

              <button
                type="button"
                className="btn btn-link p-0 ms-1 fw-semibold"
                onClick={() =>
                  setPage("student-register")
                }
              >

                Register here

              </button>

            </div>


            {/* ========================= */}
            {/* BACK */}
            {/* ========================= */}

            <div className="text-center mt-3">

              <button
                type="button"
                className="btn btn-link text-muted"
                onClick={() =>
                  setPage("role-selection")
                }
              >

                <i className="bi bi-arrow-left me-2"></i>

                Back to Role Selection

              </button>

            </div>


          </div>

        </div>

      </div>

    </div>

  )

}

export default StudentLogin