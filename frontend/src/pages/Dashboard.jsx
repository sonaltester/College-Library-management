import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    issuedBooks: 0,
    availableBooks: 0,
    overdueBooks: 0,
    totalFine: 0,
  });

  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DASHBOARD
  // =========================

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/dashboard"
      );

      setStats(response.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =========================
  // STATISTICS CARDS
  // =========================

  const cards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: "bi-book",
      color: "#0d6efd",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: "bi-people",
      color: "#198754",
    },
    {
      title: "Issued Books",
      value: stats.issuedBooks,
      icon: "bi-box-arrow-up-right",
      color: "#f59f00",
    },
    {
      title: "Available Books",
      value: stats.availableBooks,
      icon: "bi-check-circle",
      color: "#0dcaf0",
    },
    {
      title: "Overdue Books",
      value: stats.overdueBooks,
      icon: "bi-exclamation-triangle",
      color: "#dc3545",
    },
    {
      title: "Total Fine",
      value: "Rs. " + stats.totalFine,
      icon: "bi-currency-rupee",
      color: "#6c757d",
    },
  ];

  return (
    <div className="container-fluid p-4">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

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

      {/* ========================= */}
      {/* STATISTICS CARDS */}
      {/* ========================= */}

      <div className="row g-4 mb-4">

        {cards.map((card, index) => (
          <div
            className="col-xl-4 col-md-6"
            key={index}
          >
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "14px",
              }}
            >
              <div
                className="card-body p-4 d-flex align-items-center"
              >

                {/* DIRECT ICON - NO CIRCLE */}

                <div
                  className="me-4 d-flex align-items-center justify-content-center"
                  style={{
                    width: "42px",
                    minWidth: "42px",
                  }}
                >
                  <i
                    className={`bi ${card.icon}`}
                    style={{
                      fontSize: "30px",
                      color: card.color,
                      lineHeight: "1",
                    }}
                  ></i>
                </div>

                {/* STAT DETAILS */}

                <div>
                  <p
                    className="mb-1"
                    style={{
                      color: "#6c757d",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {card.title}
                  </p>

                  <h2
                    className="fw-bold mb-0"
                    style={{
                      color: "#172b4d",
                      fontSize: "28px",
                    }}
                  >
                    {loading ? "..." : card.value}
                  </h2>
                </div>

              </div>
            </div>
          </div>
        ))}

      </div>

      {/* ========================= */}
      {/* BOTTOM SECTION */}
      {/* ========================= */}

      <div className="row g-4">

        {/* ========================= */}
        {/* LIBRARY OVERVIEW */}
        {/* ========================= */}

        <div className="col-lg-7">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "14px",
            }}
          >
            <div className="card-body p-4">

              {/* OVERVIEW HEADER */}

              <div className="d-flex align-items-center mb-4">

                <i
                  className="bi bi-bar-chart-line me-3"
                  style={{
                    fontSize: "25px",
                    color: "#0d6efd",
                  }}
                ></i>

                <div>
                  <h4 className="fw-bold mb-0">
                    Library Overview
                  </h4>

                  <small className="text-muted">
                    Current library statistics
                  </small>
                </div>

              </div>

              {/* OVERVIEW STATS */}

              <div className="row text-center mt-4">

                {/* TOTAL BOOKS */}

                <div className="col-4 border-end">

                  <i
                    className="bi bi-book"
                    style={{
                      fontSize: "27px",
                      color: "#0d6efd",
                    }}
                  ></i>

                  <h2
                    className="fw-bold mt-2"
                    style={{
                      color: "#172b4d",
                    }}
                  >
                    {stats.totalBooks}
                  </h2>

                  <p className="text-muted mb-0">
                    Total Books
                  </p>

                </div>

                {/* AVAILABLE */}

                <div className="col-4 border-end">

                  <i
                    className="bi bi-check-circle"
                    style={{
                      fontSize: "27px",
                      color: "#198754",
                    }}
                  ></i>

                  <h2
                    className="fw-bold mt-2"
                    style={{
                      color: "#172b4d",
                    }}
                  >
                    {stats.availableBooks}
                  </h2>

                  <p className="text-muted mb-0">
                    Available
                  </p>

                </div>

                {/* ISSUED */}

                <div className="col-4">

                  <i
                    className="bi bi-arrow-up-right-circle"
                    style={{
                      fontSize: "27px",
                      color: "#f59f00",
                    }}
                  ></i>

                  <h2
                    className="fw-bold mt-2"
                    style={{
                      color: "#172b4d",
                    }}
                  >
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

        {/* ========================= */}
        {/* UNIVERSITY INFO */}
        {/* ========================= */}

        <div className="col-lg-5">

          <div
            className="card border-0 shadow-sm h-100 text-white"
            style={{
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, #14213d, #274c77)",
            }}
          >

            <div className="card-body p-4">

              {/* SVGU LOGO */}

              <div
                className="d-flex align-items-center"
                style={{
                  width: "65px",
                  height: "65px",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/svgu-logo.png"
                  alt="SVGU Logo"
                  style={{
                    width: "62px",
                    height: "62px",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* UNIVERSITY NAME */}

              <h3 className="fw-bold mt-3">
                Sardar Vallabhbhai
                <br />
                Global University
              </h3>

              <p
                className="mb-4"
                style={{
                  color: "#dbeafe",
                }}
              >
                SVGU College Library
                Management System
              </p>

              <hr
                style={{
                  borderColor:
                    "rgba(255,255,255,0.35)",
                }}
              />

              {/* LOCATION */}

              <div className="d-flex align-items-center mt-3">

                <i
                  className="bi bi-geo-alt me-2"
                  style={{
                    fontSize: "18px",
                  }}
                ></i>

                <span>
                  Ahmedabad, Gujarat
                </span>

              </div>

              {/* DESCRIPTION */}

              <div className="mt-3">

                <small
                  style={{
                    color: "#dbeafe",
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
  );
}

export default Dashboard;