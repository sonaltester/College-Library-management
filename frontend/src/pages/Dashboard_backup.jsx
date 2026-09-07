import { useEffect, useState } from "react"
import { getDashboardStats } from "../services/dashboardService"

function Dashboard() {

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    issuedBooks: 0,
    availableBooks: 0,
    overdueBooks: 0,
    totalFine: 0
  })

  const loadDashboard = async () => {

    try {

      const data = await getDashboardStats()

      setStats(data)

    } catch (error) {

      console.error(
        "Dashboard error:",
        error
      )

    }

  }

  useEffect(() => {

    loadDashboard()

  }, [])

  return (

    <div className="container-fluid p-4">

      <h3 className="mb-4">
        Dashboard
      </h3>

      <div className="row g-4">

        {/* Total Books */}

        <div className="col-md-4 col-lg-2">

          <div className="card shadow-sm border-0 p-3">

            <i className="bi bi-book fs-2"></i>

            <h6 className="mt-2">
              Total Books
            </h6>

            <h3>
              {stats.totalBooks}
            </h3>

          </div>

        </div>

        {/* Students */}

        <div className="col-md-4 col-lg-2">

          <div className="card shadow-sm border-0 p-3">

            <i className="bi bi-people fs-2"></i>

            <h6 className="mt-2">
              Students
            </h6>

            <h3>
              {stats.totalStudents}
            </h3>

          </div>

        </div>

        {/* Issued */}

        <div className="col-md-4 col-lg-2">

          <div className="card shadow-sm border-0 p-3">

            <i className="bi bi-journal-arrow-up fs-2"></i>

            <h6 className="mt-2">
              Issued
            </h6>

            <h3>
              {stats.issuedBooks}
            </h3>

          </div>

        </div>

        {/* Available */}

        <div className="col-md-4 col-lg-2">

          <div className="card shadow-sm border-0 p-3">

            <i className="bi bi-check-circle fs-2"></i>

            <h6 className="mt-2">
              Available
            </h6>

            <h3>
              {stats.availableBooks}
            </h3>

          </div>

        </div>

        {/* Overdue */}

        <div className="col-md-4 col-lg-2">

          <div className="card shadow-sm border-0 p-3">

            <i className="bi bi-exclamation-triangle fs-2"></i>

            <h6 className="mt-2">
              Overdue
            </h6>

            <h3>
              {stats.overdueBooks}
            </h3>

          </div>

        </div>

        {/* Fine */}

        <div className="col-md-4 col-lg-2">

          <div className="card shadow-sm border-0 p-3">

            <i className="bi bi-currency-rupee fs-2"></i>

            <h6 className="mt-2">
              Total Fine
            </h6>

            <h3>
              ?{stats.totalFine}
            </h3>

          </div>

        </div>

      </div>

      <div className="card shadow-sm border-0 p-4 mt-4">

        <h5>
          Library Overview
        </h5>

        <p className="text-muted mb-0">
          Real-time library statistics from MongoDB.
        </p>

      </div>

    </div>

  )
}

export default Dashboard
