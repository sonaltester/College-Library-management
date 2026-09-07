import { useEffect, useState } from "react"
import { getIssues, returnBook } from "../services/issueService"

function ReturnBook() {

  const [issues, setIssues] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")


  // =========================
  // FORMAT DATE
  // DD/MM/YYYY
  // =========================

  const formatDate = (dateValue) => {

    if (!dateValue) return "N/A"

    const date = new Date(dateValue)

    if (isNaN(date.getTime())) {
      return "N/A"
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    )
  }


  // =========================
  // LOAD ISSUES
  // =========================

  const loadIssues = async () => {

    try {

      const data = await getIssues()

      setIssues(data)

    } catch (error) {

      console.error(
        "Failed to load issues:",
        error
      )

    }

  }


  useEffect(() => {

    loadIssues()

  }, [])


  // =========================
  // RETURN BOOK
  // =========================

  const handleReturn = async (id) => {

    const confirmReturn = window.confirm(
      "Are you sure you want to return this book?"
    )

    if (!confirmReturn) {
      return
    }

    try {

      const data = await returnBook(id)

      alert(
        `Book returned successfully!\n\nLate Days: ${data.lateDays}\nFine: ₹${data.fine}`
      )

      loadIssues()

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to return book"
      )

    }

  }


  // =========================
  // FILTER DATA
  // =========================

  const filteredIssues = issues.filter(
    (issue) => {

      const searchText =
        `
        ${issue.book?.title || ""}
        ${issue.student?.name || ""}
        ${issue.student?.enrollmentNo || ""}
        `
          .toLowerCase()


      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        )


      const matchesStatus =
        statusFilter === "All" ||
        issue.status === statusFilter


      return (
        matchesSearch &&
        matchesStatus
      )

    }
  )


  return (

    <div className="container-fluid p-4">


      {/* ========================= */}
      {/* PAGE HEADER */}
      {/* ========================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h3 className="mb-1">
            Return Book
          </h3>

          <p className="text-muted mb-0">
            Manage issued and returned books
          </p>

        </div>


        <span className="badge bg-primary fs-6 px-3 py-2">

          Total Records: {filteredIssues.length}

        </span>

      </div>


      {/* ========================= */}
      {/* SEARCH & FILTER */}
      {/* ========================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body p-4">

          <div className="row g-3">


            {/* SEARCH */}

            <div className="col-md-8">

              <label className="form-label fw-semibold">

                Search

              </label>


              <div className="input-group">

                <span className="input-group-text">

                  <i className="bi bi-search"></i>

                </span>


                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by book, student or enrollment number..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>


            {/* STATUS */}

            <div className="col-md-4">

              <label className="form-label fw-semibold">

                Status

              </label>


              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All
                </option>

                <option value="Issued">
                  Issued
                </option>

                <option value="Returned">
                  Returned
                </option>

              </select>

            </div>


          </div>

        </div>

      </div>


      {/* ========================= */}
      {/* TABLE */}
      {/* ========================= */}

      <div className="card shadow-sm border-0">

        <div className="card-body p-4">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">


              <thead className="table-dark">

                <tr>

                  <th>#</th>

                  <th>Book</th>

                  <th>Student</th>

                  <th>Issue Date</th>

                  <th>Due Date</th>

                  <th>Status</th>

                  <th>Fine</th>

                  <th>Action</th>

                </tr>

              </thead>


              <tbody>


                {filteredIssues.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="text-center text-muted py-5"
                    >

                      <i className="bi bi-inbox fs-3 d-block mb-2"></i>

                      No records found

                    </td>

                  </tr>

                ) : (


                  filteredIssues.map(
                    (issue, index) => {


                      // =========================
                      // CHECK OVERDUE
                      // =========================

                      const isOverdue =

                        issue.status === "Issued" &&

                        new Date(
                          issue.dueDate
                        ) < new Date()


                      return (

                        <tr
                          key={issue._id}
                          className={
                            isOverdue
                              ? "table-danger"
                              : ""
                          }
                        >


                          {/* NUMBER */}

                          <td>

                            {index + 1}

                          </td>


                          {/* BOOK */}

                          <td>

                            <div className="fw-semibold">

                              {issue.book?.title || "N/A"}

                            </div>


                            <small className="text-muted">

                              {issue.book?.author || ""}

                            </small>

                          </td>


                          {/* STUDENT */}

                          <td>

                            <div className="fw-semibold">

                              {issue.student?.name || "N/A"}

                            </div>


                            <small className="text-muted">

                              {issue.student?.enrollmentNo || "N/A"}

                            </small>

                          </td>


                          {/* ISSUE DATE */}

                          <td>

                            {formatDate(
                              issue.issueDate
                            )}

                          </td>


                          {/* DUE DATE */}

                          <td>

                            {formatDate(
                              issue.dueDate
                            )}

                          </td>


                          {/* STATUS */}

                          <td>


                            {isOverdue ? (

                              <span className="badge bg-danger">

                                Overdue

                              </span>

                            ) : issue.status === "Issued" ? (

                              <span className="badge bg-warning text-dark">

                                Issued

                              </span>

                            ) : (

                              <span className="badge bg-success">

                                Returned

                              </span>

                            )}


                          </td>


                          {/* FINE */}

                          <td>

                            <strong>

                              ₹{issue.fine || 0}

                            </strong>

                          </td>


                          {/* ACTION */}

                          <td>


                            {issue.status === "Issued" ? (

                              <button
                                className="btn btn-sm btn-success"
                                onClick={() =>
                                  handleReturn(
                                    issue._id
                                  )
                                }
                              >

                                <i className="bi bi-arrow-return-left me-1"></i>

                                Return

                              </button>

                            ) : (

                              <span className="text-muted">

                                <i className="bi bi-check-circle-fill text-success me-1"></i>

                                Returned

                              </span>

                            )}


                          </td>


                        </tr>

                      )

                    }
                  )

                )}


              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  )

}

export default ReturnBook