import { useState } from "react";
import axios from "axios";

function Login({ setRole, setPage }) {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        }
      );

      const data = response.data;


      if (data.admin) {

        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin)
        );

      }


      localStorage.setItem(
        "role",
        "admin"
      );


      if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        );

      }


      setRole("admin");

      setPage("dashboard");


    } catch (error) {

      console.error(
        "Admin Login Error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Invalid email or password. Please try again."
      );


    } finally {

      setLoading(false);

    }

  };


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
          maxWidth: "950px",
          borderRadius: "20px"
        }}
      >

        <div className="row g-0">


          {/* LEFT SIDE */}

          <div
            className="col-md-5 text-white p-5 d-flex flex-column justify-content-center"
            style={{
              background:
                "linear-gradient(160deg, #172554, #1d4ed8)"
            }}
          >

            <div className="mb-4 text-center">

              <img
                src="/svgu-logo.png"
                alt="SVGU Logo"
                style={{
                  width: "150px",
                  height: "auto",
                  objectFit: "contain"
                }}
              />

            </div>


            <h2 className="fw-bold mb-3">
              SVGU Admin Portal
            </h2>


            <p
              className="mb-4"
              style={{
                color: "#dbeafe",
                lineHeight: "1.7"
              }}
            >
              Securely manage the SVGU Library Management
              System including books, students, issues and returns.
            </p>


            <div className="mb-3">

              <i className="bi bi-check-circle-fill me-2"></i>

              Manage Library Books

            </div>


            <div className="mb-3">

              <i className="bi bi-check-circle-fill me-2"></i>

              Manage Students

            </div>


            <div className="mb-3">

              <i className="bi bi-check-circle-fill me-2"></i>

              Issue & Return Books

            </div>


            <div>

              <i className="bi bi-check-circle-fill me-2"></i>

              Monitor Library Activities

            </div>

          </div>


          {/* RIGHT SIDE */}

          <div className="col-md-7 bg-white p-4 p-md-5">

            <div className="mb-4">

              <h2 className="fw-bold mb-2">
                Admin Login
              </h2>

              <p className="text-muted mb-0">
                Sign in to access the SVGU Library Administration Portal.
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


              {/* EMAIL */}

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Email Address
                </label>


                <input
                  type="email"
                  name="email"
                  className="form-control py-2"
                  placeholder="Enter admin email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="mb-4">

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
                    name="password"
                    className="form-control py-2"
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />


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


              {/* LOGIN BUTTON */}

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
                    Login to Admin Portal
                  </>

                )}

              </button>


            </form>


            {/* REGISTER */}

            <div className="text-center mt-4">

              <span className="text-muted">
                New administrator?
              </span>


              <button
                type="button"
                className="btn btn-link p-0 ms-2 fw-semibold"
                onClick={() =>
                  setPage("admin-register")
                }
              >
                Create Admin Account
              </button>

            </div>


            {/* BACK */}

            <div className="text-center mt-3">

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  setPage("role-selection")
                }
              >

                <i className="bi bi-arrow-left me-2"></i>

                Back

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Login;