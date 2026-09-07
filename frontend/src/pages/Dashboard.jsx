import { useEffect, useState } from "react"
import axios from "axios"

function Dashboard() {

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    issuedBooks: 0,
    availableBooks: 0,
    overdueBooks: 0,
    totalFine: 0
  })

  const [loading, setLoading] = useState(true)

  const fetchDashboard = async () => {

    try {

      setLoading(true)

      const response = await axios.get(
        "http://localhost:5000/api/dashboard"
      )

      setStats(response.data)

    } catch (error) {

      console.error("Dashboard error:", error)

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    fetchDashboard()

  }, [])


  const cards = [

    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: "bi-book",
      color: "primary"
    },

    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: "bi-people",
      color: "success"
    },

    {
      title: "Issued Books",
      value: stats.issuedBooks,
      icon: "bi-box-arrow-up-right",
      color: "warning"
    },

    {
      title: "Available Books",
      value: stats.availableBooks,
      icon: "bi-check-circle",
      color: "info"
    },

    {
      title: "Overdue Books",
      value: stats.overdueBooks,
      icon: "bi-exclamation-triangle",
      color: "danger"
    },

    {
      title: "Total Fine",
      value: `₹${stats.totalFine}`,
      icon: "bi-currency-rupee",
      color: "secondary"
    }

  ]


  return (

    <div className="container-fluid p-4">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h1 className="fw-bold mb-1">
            Dashboard
          </h1>

          <p className="text-muted mb-0">
            Welcome to SVGU College Library Management System
          </p>

        </div>


        <button
          className="btn btn-primary px-4"
          onClick={fetchDashboard}
        >

          <i className="bi bi-arrow-clockwise me-2"></i>

          Refresh

        </button>

      </div>


      {/* STATISTICS CARDS */}

      <div className="row g-4 mb-4">

        {cards.map((card, index) => (

          <div
            className="col-xl-4 col-md-6"
            key={index}
          >

            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "14px"
              }}
            >

              <div className="card-body p-4 d-flex align-items-center">

                <div
                  className={`bg-${card.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3`}
                  style={{
                    width: "58px",
                    height: "58px"
                  }}
                >

                  <i
                    className={`bi ${card.icon} fs-3 text-${card.color}`}
                  ></i>

                </div>


                <div>

                  <p className="text-muted mb-1">

                    {card.title}

                  </p>


                  <h2 className="fw-bold mb-0">

                    {loading
                      ? "..."
                      : card.value}

                  </h2>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* BOTTOM SECTION */}

      <div className="row g-4">

        {/* LIBRARY OVERVIEW */}

        <div className="col-lg-7">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "14px"
            }}
          >

            <div className="card-body p-4">

              <div className="d-flex align-items-center mb-4">

                <div
                  className="bg-primary bg-opacity-10 rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{
                    width: "45px",
                    height: "45px"
                  }}
                >

                  <i className="bi bi-bar-chart-line text-primary fs-4"></i>

                </div>


                <div>

                  <h4 className="fw-bold mb-0">

                    Library Overview

                  </h4>

                  <small className="text-muted">

                    Current library statistics

                  </small>

                </div>

              </div>


              <div className="row text-center mt-4">

                <div className="col-4 border-end">

                  <i className="bi bi-book fs-2 text-primary"></i>

                  <h2 className="fw-bold mt-2">

                    {stats.totalBooks}

                  </h2>

                  <p className="text-muted mb-0">

                    Total Books

                  </p>

                </div>


                <div className="col-4 border-end">

                  <i className="bi bi-check-circle fs-2 text-success"></i>

                  <h2 className="fw-bold mt-2">

                    {stats.availableBooks}

                  </h2>

                  <p className="text-muted mb-0">

                    Available

                  </p>

                </div>


                <div className="col-4">

                  <i className="bi bi-arrow-up-right-circle fs-2 text-warning"></i>

                  <h2 className="fw-bold mt-2">

                    {stats.issuedBooks}

                  </h2>

                  <p className="text-muted mb-0">

                    Issued

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* UNIVERSITY INFO */}

        <div className="col-lg-5">

          <div
            className="card border-0 shadow-sm h-100 text-white"
            style={{
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, #14213d, #274c77)"
            }}
          >

            <div className="card-body p-4">

              <i className="bi bi-mortarboard fs-1"></i>


              <h3 className="fw-bold mt-3">

                Sardar Vallabhbhai
                <br />
                Global University

              </h3>


              <p
                className="mb-4"
                style={{
                  color: "#dbeafe"
                }}
              >

                SVGU College Library
                Management System

              </p>


              <hr
                style={{
                  borderColor:
                    "rgba(255,255,255,0.35)"
                }}
              />


              <div className="d-flex align-items-center mt-3">

                <i className="bi bi-building me-2"></i>

                <span>

                  Ahmedabad, Gujarat

                </span>

              </div>


              <div className="mt-3">

                <small
                  style={{
                    color: "#dbeafe"
                  }}
                >

                  Manage books, students and
                  library activities efficiently.

                </small>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default Dashboard