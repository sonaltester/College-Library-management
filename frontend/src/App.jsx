import { useEffect, useState } from "react"

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

import axios from "axios"


function App() {

  // =========================
  // GET INITIAL ROLE
  // =========================

  const getInitialRole = () => {

    const savedRole = localStorage.getItem("role")

    const token = localStorage.getItem("token")

    const student = localStorage.getItem("student")


    if (savedRole === "admin" && token) {
      return "admin"
    }


    if (savedRole === "student" && student) {
      return "student"
    }


    return null
  }


  const [role, setRole] = useState(getInitialRole)


  // =========================
  // GET INITIAL PAGE
  // =========================

  const getInitialPage = () => {

    const currentRole = getInitialRole()


    if (currentRole === "admin") {
      return "dashboard"
    }


    if (currentRole === "student") {
      return "student-dashboard"
    }


    return "role-selection"
  }


  const [page, setPage] = useState(getInitialPage)


  // =========================
  // STUDENT NOTIFICATIONS
  // =========================

  const [notifications, setNotifications] = useState([])

  const [showNotifications, setShowNotifications] =
    useState(false)


  // =========================
  // LOAD STUDENT NOTIFICATIONS
  // =========================

  useEffect(() => {

    if (role !== "student") {
      return
    }


    const loadNotifications = async () => {

      try {

        const student = JSON.parse(
          localStorage.getItem("student") || "{}"
        )


        if (!student?._id) {
          return
        }


        const response = await axios.get(
          "http://localhost:5000/api/issues"
        )


        const allIssues = response.data


        // Only current student's books
        const myIssues = allIssues.filter((issue) => {

          const issueStudent =
            issue.student?._id ||
            issue.student ||
            issue.studentId


          return String(issueStudent) ===
            String(student._id)

        })


        // Only active issued books
        const activeIssues = myIssues.filter(
          (issue) => !issue.returnDate
        )


        const today = new Date()

        today.setHours(0, 0, 0, 0)


        const newNotifications = []


        activeIssues.forEach((issue) => {

          if (!issue.dueDate) {
            return
          }


          const dueDate = new Date(
            issue.dueDate
          )


          if (isNaN(dueDate.getTime())) {
            return
          }


          dueDate.setHours(0, 0, 0, 0)


          const difference =
            dueDate.getTime() -
            today.getTime()


          const daysRemaining = Math.ceil(
            difference /
              (1000 * 60 * 60 * 24)
          )


          const bookTitle =
            issue.book?.title ||
            issue.bookName ||
            "Book"


          // =========================
          // OVERDUE
          // =========================

          if (daysRemaining < 0) {

            const overdueDays =
              Math.abs(daysRemaining)


            newNotifications.push({

              id: `${issue._id}-overdue`,

              type: "overdue",

              icon: "bi-exclamation-triangle-fill",

              title: "Book Overdue",

              message:
                `${bookTitle} is overdue by ${overdueDays} day${overdueDays === 1 ? "" : "s"}. Please return it as soon as possible.`

            })


            return
          }


          // =========================
          // DUE TODAY
          // =========================

          if (daysRemaining === 0) {

            newNotifications.push({

              id: `${issue._id}-today`,

              type: "today",

              icon: "bi-bell-fill",

              title: "Return Book Today",

              message:
                `${bookTitle} is due today. Please return the book.`

            })


            return
          }


          // =========================
          // DUE TOMORROW
          // =========================

          if (daysRemaining === 1) {

            newNotifications.push({

              id: `${issue._id}-tomorrow`,

              type: "warning",

              icon: "bi-clock-fill",

              title: "Book Due Tomorrow",

              message:
                `${bookTitle} is due tomorrow. Please return it on time.`

            })


            return
          }


          // =========================
          // DUE IN 2 DAYS
          // =========================

          if (daysRemaining === 2) {

            newNotifications.push({

              id: `${issue._id}-2days`,

              type: "warning",

              icon: "bi-clock-fill",

              title: "Book Due Soon",

              message:
                `${bookTitle} is due in 2 days.`

            })


            return
          }


          // =========================
          // DUE IN 3 DAYS
          // =========================

          if (daysRemaining === 3) {

            newNotifications.push({

              id: `${issue._id}-3days`,

              type: "info",

              icon: "bi-info-circle-fill",

              title: "Book Due Soon",

              message:
                `${bookTitle} is due in 3 days.`

            })

          }

        })


        setNotifications(
          newNotifications
        )


      } catch (error) {

        console.error(
          "Notification error:",
          error
        )

      }

    }


    loadNotifications()


    // Check notifications every 5 minutes
    const interval = setInterval(
      loadNotifications,
      5 * 60 * 1000
    )


    return () => {
      clearInterval(interval)
    }

  }, [role])


  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    localStorage.removeItem("token")

    localStorage.removeItem("role")

    localStorage.removeItem("student")

    localStorage.removeItem("admin")


    setNotifications([])

    setShowNotifications(false)

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


            {/* SVGU LOGO */}

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


            {/* TITLE */}

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


            {/* ADMIN LOGIN BUTTON */}

            <button
              className="btn btn-primary w-100 py-3 mb-3 fw-semibold"
              onClick={() =>
                setPage("admin-login")
              }
            >

              <i className="bi bi-person-lock me-2"></i>

              Admin Login

            </button>


            {/* STUDENT LOGIN BUTTON */}

            <button
              className="btn btn-success w-100 py-3 fw-semibold"
              onClick={() =>
                setPage("student-login")
              }
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
          style={{
            minWidth: 0
          }}
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


        {/* ========================= */}
        {/* STUDENT NAVBAR */}
        {/* ========================= */}

        <nav
          className="navbar navbar-expand-lg px-4 py-3"
          style={{
            background:
              "linear-gradient(90deg, #0f172a, #1e3a5f)"
          }}
        >

          {/* LOGO / TITLE */}

          <span className="navbar-brand text-white fw-bold">

            <i className="bi bi-book me-2"></i>

            SVGU Student Library Portal

          </span>


          {/* RIGHT SIDE */}

          <div className="d-flex flex-wrap align-items-center gap-2 ms-auto">


            {/* ========================= */}
            {/* NOTIFICATION */}
            {/* ========================= */}

            <div
              className="position-relative"
            >

              <button
                type="button"
                className="btn btn-light btn-sm position-relative"
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
                style={{
                  width: "40px",
                  height: "34px"
                }}
              >

                <i className="bi bi-bell"></i>


                {/* NOTIFICATION COUNT */}

                {notifications.length > 0 && (

                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{
                      fontSize: "10px"
                    }}
                  >

                    {notifications.length}

                  </span>

                )}

              </button>


              {/* ========================= */}
              {/* NOTIFICATION DROPDOWN */}
              {/* ========================= */}

              {showNotifications && (

                <div
                  className="position-absolute bg-white shadow-lg border"
                  style={{
                    right: 0,
                    top: "45px",
                    width: "360px",
                    maxWidth: "90vw",
                    zIndex: 1050,
                    borderRadius: "12px",
                    overflow: "hidden"
                  }}
                >

                  {/* HEADER */}

                  <div
                    className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom"
                  >

                    <strong>
                      <i className="bi bi-bell me-2"></i>
                      Notifications
                    </strong>


                    <span className="badge bg-primary">

                      {notifications.length}

                    </span>

                  </div>


                  {/* NOTIFICATIONS */}

                  {notifications.length === 0 ? (

                    <div
                      className="text-center p-4 text-muted"
                    >

                      <i
                        className="bi bi-check-circle fs-3 d-block mb-2"
                      ></i>

                      No new notifications

                    </div>

                  ) : (

                    <div
                      style={{
                        maxHeight: "350px",
                        overflowY: "auto"
                      }}
                    >

                      {notifications.map(
                        (notification) => (

                          <div
                            key={notification.id}
                            className="px-3 py-3 border-bottom"
                          >

                            <div className="d-flex">

                              <div
                                className="me-3"
                                style={{
                                  width: "34px",
                                  height: "34px",
                                  borderRadius: "50%",
                                  background:
                                    notification.type === "overdue"
                                      ? "#fde2e2"
                                      : notification.type === "today"
                                      ? "#fff0d9"
                                      : "#e8f0ff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                              >

                                <i
                                  className={`bi ${notification.icon}`}
                                  style={{
                                    color:
                                      notification.type === "overdue"
                                        ? "#dc3545"
                                        : notification.type === "today"
                                        ? "#d97706"
                                        : "#2563eb"
                                  }}
                                ></i>

                              </div>


                              <div>

                                <div
                                  className="fw-semibold"
                                  style={{
                                    fontSize: "14px"
                                  }}
                                >

                                  {notification.title}

                                </div>


                                <div
                                  className="text-muted mt-1"
                                  style={{
                                    fontSize: "13px",
                                    lineHeight: "1.4"
                                  }}
                                >

                                  {notification.message}

                                </div>

                              </div>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>

              )}

            </div>


            {/* ========================= */}
            {/* DASHBOARD */}
            {/* ========================= */}

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


            {/* ========================= */}
            {/* BOOKS */}
            {/* ========================= */}

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


            {/* ========================= */}
            {/* MY BOOKS */}
            {/* ========================= */}

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


            {/* ========================= */}
            {/* PROFILE */}
            {/* ========================= */}

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


            {/* ========================= */}
            {/* LOGOUT */}
            {/* ========================= */}

            <button
              className="btn btn-danger btn-sm"
              onClick={logout}
            >

              <i className="bi bi-box-arrow-right me-1"></i>

              Logout

            </button>


          </div>

        </nav>


        {/* ========================= */}
        {/* STUDENT PAGES */}
        {/* ========================= */}

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