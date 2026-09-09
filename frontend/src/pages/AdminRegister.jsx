import { useState } from "react"
import axios from "axios"

function AdminRegister({ setPage }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Password show/hide
  const [showPassword, setShowPassword] = useState(false)

  // Confirm Password show/hide
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }


  const handleSubmit = async (e) => {

    e.preventDefault()

    setError("")
    setSuccess("")


    // Check password

    if (formData.password !== formData.confirmPassword) {

      setError("Passwords do not match")

      return

    }


    try {

      setLoading(true)


      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      )


      setSuccess(
        response.data.message ||
        "Admin registered successfully!"
      )


      // Clear all fields

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      })


      // Hide password after registration

      setShowPassword(false)
      setShowConfirmPassword(false)


      // Go to login

      setTimeout(() => {

        setPage("admin-login")

      }, 1500)


    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Admin registration failed"
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
          "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #2563eb 100%)"
      }}
    >

      <div
        className="card border-0 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "20px"
        }}
      >

        <div className="card-body p-4 p-md-5">


          {/* HEADER */}

          <div className="text-center mb-4">

            {/* SVGU LOGO */}

            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: "105px",
                height: "105px"
              }}
            >

              <img
                src="/svgu-logo.png"
                alt="SVGU Logo"
                style={{
                  width: "105px",
                  height: "105px",
                  objectFit: "contain"
                }}
              />

            </div>


            <h2 className="fw-bold">
              Admin Registration
            </h2>


            <p className="text-muted">
              Create your administrator account
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="alert alert-danger">

              <i className="bi bi-exclamation-circle me-2"></i>

              {error}

            </div>

          )}


          {/* SUCCESS */}

          {success && (

            <div className="alert alert-success">

              <i className="bi bi-check-circle me-2"></i>

              {success}

            </div>

          )}


          <form
            onSubmit={handleSubmit}
            autoComplete="off"
          >


            {/* FULL NAME */}

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Full Name
              </label>


              <div className="input-group">

                <span className="input-group-text bg-white">

                  <i className="bi bi-person"></i>

                </span>


                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={formData.name}
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


              <div className="input-group">

                <span className="input-group-text bg-white">

                  <i className="bi bi-envelope"></i>

                </span>


                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Password
              </label>


              <div className="input-group">

                <span className="input-group-text bg-white">

                  <i className="bi bi-lock"></i>

                </span>


                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  className="form-control"
                  placeholder="Create a password"
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


            {/* CONFIRM PASSWORD */}

            <div className="mb-4">

              <label className="form-label fw-semibold">
                Confirm Password
              </label>


              <div className="input-group">

                <span className="input-group-text bg-white">

                  <i className="bi bi-shield-lock"></i>

                </span>


                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />


                {/* EYE BUTTON */}

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >

                  <i
                    className={
                      showConfirmPassword
                        ? "bi bi-eye-slash"
                        : "bi bi-eye"
                    }
                  ></i>

                </button>

              </div>

            </div>


            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >

              {loading ? (

                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Registering...
                </>

              ) : (

                <>
                  <i className="bi bi-person-plus me-2"></i>
                  Create Admin Account
                </>

              )}

            </button>


            {/* BACK TO LOGIN */}

            <button
              type="button"
              className="btn btn-outline-secondary w-100 mt-3"
              onClick={() => setPage("admin-login")}
            >

              <i className="bi bi-arrow-left me-2"></i>

              Back to Login

            </button>


          </form>

        </div>

      </div>

    </div>

  )

}

export default AdminRegister