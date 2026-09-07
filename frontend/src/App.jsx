import { useState } from "react"

import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"

import Dashboard from "./pages/Dashboard"
import Books from "./pages/Books"
import Students from "./pages/Students"
import IssueBook from "./pages/IssueBook"
import ReturnBook from "./pages/ReturnBook"

import Login from "./pages/Login"
import AdminRegister from "./pages/AdminRegister"

import StudentLogin from "./pages/StudentLogin"
import StudentRegister from "./pages/StudentRegister"
import StudentDashboard from "./pages/StudentDashboard"
import StudentBooks from "./pages/StudentBooks"
import StudentMyBooks from "./pages/StudentMyBooks"
import StudentProfile from "./pages/StudentProfile"

function App() {
  const getInitialRole = () => {
    const savedRole = localStorage.getItem("role")
    const token = localStorage.getItem("token")
    const student = localStorage.getItem("student")

    if (savedRole === "admin" && token) return "admin"

    if (savedRole === "student" && student) return "student"

    return null
  }

  const [role, setRole] = useState(getInitialRole)

  const getInitialPage = () => {
    const currentRole = getInitialRole()

    if (currentRole === "admin") return "dashboard"

    if (currentRole === "student") return "student-dashboard"

    return "role-selection"
  }

  const [page, setPage] = useState(getInitialPage)

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("student")
    localStorage.removeItem("admin")

    setRole(null)
    setPage("role-selection")
  }

  // =========================
  // ADMIN LOGIN
  // =========================

  if (!role && page === "admin-login") {
    return (
      <Login
        setRole={setRole}
        setPage={setPage}
      />
    )
  }

  // =========================
  // ADMIN REGISTER
  // =========================

  if (!role && page === "admin-register") {
    return (
      <AdminRegister
        setPage={setPage}
      />
    )
  }

  // =========================
  // STUDENT LOGIN
  // =========================

  if (!role && page === "student-login") {
    return (
      <StudentLogin
        setRole={setRole}
        setPage={setPage}
      />
    )
  }

  // =========================
  // STUDENT REGISTER
  // =========================

  if (!role && page === "student-register") {
    return (
      <StudentRegister
        setPage={setPage}
      />
    )
  }

  // =========================
  // ROLE SELECTION
  // =========================

  if (!role) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center p-3"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #2563eb 100%)"
        }}
      >
        <div
          className="card border-0 shadow-lg p-4"
          style={{
            width: "100%",
            maxWidth: "440px",
            borderRadius: "20px"
          }}
        >
          <div className="text-center">

            {/* =========================
                SVGU LOGO
            ========================= */}

            <div className="mx-auto mb-3 d-flex align-items-center justify-content-center">
              <img
                src="/svgu-logo.png"
                alt="SVGU Logo"
                style={{
                  width: "115px",
                  height: "115px",
                  objectFit: "contain"
                }}
              />
            </div>

            <h2 className="fw-bold mb-2">
              SVGU Library
            </h2>

            <p className="text-muted mb-1">
              Library Management System
            </p>

            <small className="text-muted">
              Select your portal to continue
            </small>

            <hr className="my-4" />

            <button
              className="btn btn-primary w-100 py-3 mb-3 fw-semibold"
              onClick={() => setPage("admin-login")}
            >
              <i className="bi bi-person-lock me-2"></i>
              Admin Login
            </button>

            <button
              className="btn btn-success w-100 py-3 fw-semibold"
              onClick={() => setPage("student-login")}
            >
              <i className="bi bi-mortarboard me-2"></i>
              Student Login
            </button>

            <div className="mt-4">
              <small className="text-muted">
                Sardar Vallabhbhai Global University
              </small>
            </div>

          </div>
        </div>
      </div>
    )
  }

  // =========================
  // ADMIN PORTAL
  // =========================

  if (role === "admin") {
    return (
      <div
        className="d-flex"
        style={{
          background: "#f5f7fb",
          minHeight: "100vh"
        }}
      >

        <Sidebar
          setPage={setPage}
          setLoggedIn={logout}
          page={page}
        />

        <div
          className="flex-grow-1"
          style={{ minWidth: 0 }}
        >

          <Navbar />

          <main>

            {page === "dashboard" && (
              <Dashboard />
            )}

            {page === "books" && (
              <Books />
            )}

            {page === "students" && (
              <Students />
            )}

            {page === "issue" && (
              <IssueBook />
            )}

            {page === "return" && (
              <ReturnBook />
            )}

          </main>

        </div>
      </div>
    )
  }

  // =========================
  // STUDENT PORTAL
  // =========================

  if (role === "student") {
    return (
      <div
        className="min-vh-100"
        style={{
          background: "#f5f7fb"
        }}
      >

        <nav
          className="navbar navbar-expand-lg px-4 py-3"
          style={{
            background:
              "linear-gradient(90deg, #0f172a, #1e3a5f)"
          }}
        >

          <span className="navbar-brand text-white fw-bold">
            <i className="bi bi-book me-2"></i>
            SVGU Student Library Portal
          </span>

          <div className="d-flex flex-wrap gap-2 ms-auto">

            <button
              className={`btn btn-sm ${
                page === "student-dashboard"
                  ? "btn-primary"
                  : "btn-light"
              }`}
              onClick={() =>
                setPage("student-dashboard")
              }
            >
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </button>

            <button
              className={`btn btn-sm ${
                page === "student-books"
                  ? "btn-primary"
                  : "btn-light"
              }`}
              onClick={() =>
                setPage("student-books")
              }
            >
              <i className="bi bi-book me-1"></i>
              Books
            </button>

            <button
              className={`btn btn-sm ${
                page === "student-my-books"
                  ? "btn-primary"
                  : "btn-light"
              }`}
              onClick={() =>
                setPage("student-my-books")
              }
            >
              <i className="bi bi-journal-bookmark me-1"></i>
              My Books
            </button>

            <button
              className={`btn btn-sm ${
                page === "student-profile"
                  ? "btn-primary"
                  : "btn-light"
              }`}
              onClick={() =>
                setPage("student-profile")
              }
            >
              <i className="bi bi-person me-1"></i>
              Profile
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Logout
            </button>

          </div>

        </nav>

        <main>

          {page === "student-dashboard" && (
            <StudentDashboard />
          )}

          {page === "student-books" && (
            <StudentBooks />
          )}

          {page === "student-my-books" && (
            <StudentMyBooks />
          )}

          {page === "student-profile" && (
            <StudentProfile />
          )}

        </main>

      </div>
    )
  }

  return null
}

export default App