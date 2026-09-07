import { useState } from "react"

function StudentDashboard() {

  const studentData = JSON.parse(
    localStorage.getItem("student") || "{}"
  )

  const studentName =
    studentData.name ||
    studentData.studentName ||
    "Student"

  const [activeCard, setActiveCard] = useState(null)

  return (

    <div
      className="container-fluid py-4 px-4"
      style={{
        background: "#f4f7fb",
        minHeight: "calc(100vh - 76px)"
      }}
    >

      {/* PAGE HEADER */}

      <div className="mb-4">

        <h2
          className="fw-bold mb-1"
          style={{
            color: "#1e293b"
          }}
        >
          Student Dashboard
        </h2>

        <p
          className="mb-0"
          style={{
            color: "#64748b"
          }}
        >
          Manage your library activities and account information
        </p>

      </div>


      {/* WELCOME CARD */}

      <div
        className="card border-0 shadow-sm mb-4"
        style={{
          borderRadius: "16px",
          overflow: "hidden"
        }}
      >

        <div
          className="card-body p-4"
          style={{
            background:
              "linear-gradient(135deg, #17345c, #285b9f)"
          }}
        >

          <div className="row align-items-center">

            <div className="col-md-8">

              <div
                className="d-flex align-items-center mb-3"
              >

                <div
                  className="d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "58px",
                    height: "58px",
                    borderRadius: "14px",
                    background:
                      "rgba(255,255,255,0.15)"
                  }}
                >

                  <i
                    className="bi bi-mortarboard-fill fs-3 text-white"
                  ></i>

                </div>


                <div>

                  <p
                    className="mb-1"
                    style={{
                      color:
                        "rgba(255,255,255,0.75)"
                    }}
                  >
                    Welcome back
                  </p>

                  <h3
                    className="fw-bold text-white mb-0"
                  >
                    {studentName}
                  </h3>

                </div>

              </div>


              <p
                className="mb-0"
                style={{
                  color:
                    "rgba(255,255,255,0.8)"
                }}
              >
                Welcome to the SVGU College Library Portal.
                Explore books and manage your issued books easily.
              </p>

            </div>


            <div
              className="col-md-4 text-md-end mt-3 mt-md-0"
            >

              <div
                className="d-inline-flex align-items-center"
                style={{
                  background:
                    "rgba(255,255,255,0.12)",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  color: "white"
                }}
              >

                <i
                  className="bi bi-book me-2"
                ></i>

                Student Portal

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* QUICK ACCESS TITLE */}

      <div className="mb-3">

        <h4
          className="fw-bold mb-1"
          style={{
            color: "#1e293b"
          }}
        >
          Quick Access
        </h4>

        <p
          className="text-muted mb-0"
        >
          Access your library services quickly
        </p>

      </div>


      {/* CARDS */}

      <div className="row g-4">


        {/* AVAILABLE BOOKS */}

        <div className="col-md-4">

          <div
            className="card border-0 shadow-sm h-100"
            onMouseEnter={() =>
              setActiveCard("books")
            }
            onMouseLeave={() =>
              setActiveCard(null)
            }
            style={{
              borderRadius: "16px",
              cursor: "pointer",
              transition: "0.3s",
              transform:
                activeCard === "books"
                  ? "translateY(-6px)"
                  : "translateY(0)"
            }}
          >

            <div className="card-body p-4">

              <div
                className="d-flex align-items-center justify-content-between mb-4"
              >

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "58px",
                    height: "58px",
                    borderRadius: "14px",
                    background: "#e8f0ff",
                    color: "#2563eb"
                  }}
                >

                  <i
                    className="bi bi-book fs-3"
                  ></i>

                </div>


                <i
                  className="bi bi-arrow-up-right fs-4"
                  style={{
                    color: "#94a3b8"
                  }}
                ></i>

              </div>


              <h4 className="fw-bold">

                Available Books

              </h4>


              <p className="text-muted mb-0">

                Search and explore books available
                in the college library.

              </p>

            </div>

          </div>

        </div>


        {/* MY BOOKS */}

        <div className="col-md-4">

          <div
            className="card border-0 shadow-sm h-100"
            onMouseEnter={() =>
              setActiveCard("mybooks")
            }
            onMouseLeave={() =>
              setActiveCard(null)
            }
            style={{
              borderRadius: "16px",
              cursor: "pointer",
              transition: "0.3s",
              transform:
                activeCard === "mybooks"
                  ? "translateY(-6px)"
                  : "translateY(0)"
            }}
          >

            <div className="card-body p-4">

              <div
                className="d-flex align-items-center justify-content-between mb-4"
              >

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "58px",
                    height: "58px",
                    borderRadius: "14px",
                    background: "#e9f8f1",
                    color: "#15803d"
                  }}
                >

                  <i
                    className="bi bi-journal-bookmark fs-3"
                  ></i>

                </div>


                <i
                  className="bi bi-arrow-up-right fs-4"
                  style={{
                    color: "#94a3b8"
                  }}
                ></i>

              </div>


              <h4 className="fw-bold">

                My Books

              </h4>


              <p className="text-muted mb-0">

                View your currently issued books,
                due dates and return status.

              </p>

            </div>

          </div>

        </div>


        {/* PROFILE */}

        <div className="col-md-4">

          <div
            className="card border-0 shadow-sm h-100"
            onMouseEnter={() =>
              setActiveCard("profile")
            }
            onMouseLeave={() =>
              setActiveCard(null)
            }
            style={{
              borderRadius: "16px",
              cursor: "pointer",
              transition: "0.3s",
              transform:
                activeCard === "profile"
                  ? "translateY(-6px)"
                  : "translateY(0)"
            }}
          >

            <div className="card-body p-4">

              <div
                className="d-flex align-items-center justify-content-between mb-4"
              >

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "58px",
                    height: "58px",
                    borderRadius: "14px",
                    background: "#fff4e5",
                    color: "#d97706"
                  }}
                >

                  <i
                    className="bi bi-person-circle fs-3"
                  ></i>

                </div>


                <i
                  className="bi bi-arrow-up-right fs-4"
                  style={{
                    color: "#94a3b8"
                  }}
                ></i>

              </div>


              <h4 className="fw-bold">

                My Profile

              </h4>


              <p className="text-muted mb-0">

                View and manage your personal
                and academic information.

              </p>

            </div>

          </div>

        </div>


      </div>


      {/* INFORMATION SECTION */}

      <div className="row g-4 mt-2">


        <div className="col-md-8">

          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "16px"
            }}
          >

            <div className="card-body p-4">

              <h5 className="fw-bold mb-3">

                <i
                  className="bi bi-info-circle me-2 text-primary"
                ></i>

                Library Information

              </h5>


              <div
                className="d-flex align-items-center mb-3"
              >

                <div
                  className="me-3 text-primary"
                >
                  <i className="bi bi-clock fs-5"></i>
                </div>

                <div>

                  <strong>
                    Issue Duration
                  </strong>

                  <div className="text-muted">

                    Books are generally issued
                    according to library rules.

                  </div>

                </div>

              </div>


              <div
                className="d-flex align-items-center"
              >

                <div
                  className="me-3 text-warning"
                >
                  <i className="bi bi-exclamation-circle fs-5"></i>
                </div>

                <div>

                  <strong>
                    Return Reminder
                  </strong>

                  <div className="text-muted">

                    Please return books before
                    the due date to avoid fines.

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        <div className="col-md-4">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "16px",
              background: "#ffffff"
            }}
          >

            <div className="card-body p-4">

              <div
                className="d-flex align-items-center mb-3"
              >

                <div
                  className="d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#eef4ff",
                    color: "#2563eb"
                  }}
                >

                  <i className="bi bi-building fs-4"></i>

                </div>


                <div>

                  <h6 className="fw-bold mb-1">

                    SVGU Library

                  </h6>

                  <small className="text-muted">

                    Student Services

                  </small>

                </div>

              </div>


              <hr />


              <p
                className="text-muted mb-0"
              >

                Manage your books and library
                activities from one convenient place.

              </p>

            </div>

          </div>

        </div>


      </div>


    </div>

  )

}

export default StudentDashboard