import { useEffect, useState } from "react"
import axios from "axios"

function StudentMyBooks() {

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  const student = JSON.parse(
    localStorage.getItem("student")
  )

  // Fixed date format: DD/MM/YYYY
  const formatDate = (date) => {

    if (!date) {
      return "-"
    }

    const d = new Date(date)

    if (isNaN(d.getTime())) {
      return "-"
    }

    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()

    return `${day}/${month}/${year}`
  }


  // Get today's date without time
  const getToday = () => {

    const today = new Date()

    today.setHours(0, 0, 0, 0)

    return today
  }


  // Calculate days remaining
  const getDaysRemaining = (dueDate) => {

    if (!dueDate) {
      return null
    }

    const due = new Date(dueDate)

    if (isNaN(due.getTime())) {
      return null
    }

    due.setHours(0, 0, 0, 0)

    const today = getToday()

    const difference =
      due.getTime() - today.getTime()

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )
  }


  // Book status
  const getStatus = (issue) => {

    // Already returned
    if (issue.returnDate) {

      return {
        text: "Returned",
        className: "bg-success"
      }

    }

    const daysRemaining =
      getDaysRemaining(issue.dueDate)


    // Overdue
    if (
      daysRemaining !== null &&
      daysRemaining < 0
    ) {

      return {
        text: "Overdue",
        className: "bg-danger"
      }

    }


    // Due today
    if (daysRemaining === 0) {

      return {
        text: "Due Today",
        className: "bg-danger"
      }

    }


    // Due within 3 days
    if (
      daysRemaining !== null &&
      daysRemaining <= 3
    ) {

      return {
        text: `Due in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`,
        className: "bg-warning text-dark"
      }

    }


    // Normal issued book
    return {
      text: "Issued",
      className: "bg-primary"
    }

  }


  useEffect(() => {

    const loadMyBooks = async () => {

      try {

        const response = await axios.get(
          "http://localhost:5000/api/issues"
        )

        const allIssues = response.data

        const myBooks = allIssues.filter((issue) => {

          const issueStudent =
            issue.student?._id ||
            issue.student ||
            issue.studentId

          return String(issueStudent) ===
            String(student?._id)

        })

        setBooks(myBooks)

      } catch (error) {

        console.error(
          "My Books error:",
          error
        )

      } finally {

        setLoading(false)

      }

    }

    loadMyBooks()

  }, [])


  return (

    <div className="container p-4">

      {/* PAGE HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="mb-1">
            My Issued Books
          </h2>

          <p className="text-muted mb-0">
            View your issued and returned books
          </p>

        </div>

        <span className="badge bg-primary fs-6">

          {books.length} Books

        </span>

      </div>


      {/* LOADING */}

      {loading ? (

        <div className="text-center p-4">

          <div
            className="spinner-border text-primary"
            role="status"
          ></div>

          <p className="mt-2 text-muted">
            Loading your books...
          </p>

        </div>

      ) : books.length === 0 ? (

        /* NO BOOKS */

        <div className="alert alert-info">

          <i className="bi bi-info-circle me-2"></i>

          No books issued to you.

        </div>

      ) : (

        /* BOOK TABLE */

        <div className="card shadow-sm border-0">

          <div className="card-body">

            <h5 className="mb-3">

              <strong>
                My Books
              </strong>

            </h5>


            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead className="table-light">

                  <tr>

                    <th>#</th>

                    <th>Book</th>

                    <th>Issue Date</th>

                    <th>Due Date</th>

                    <th>Status</th>

                  </tr>

                </thead>


                <tbody>

                  {books.map(
                    (issue, index) => {

                      const status =
                        getStatus(issue)

                      return (

                        <tr
                          key={issue._id}
                        >

                          {/* NUMBER */}

                          <td>
                            {index + 1}
                          </td>


                          {/* BOOK */}

                          <td>

                            <strong>

                              {issue.book?.title ||
                                issue.bookName ||
                                "Book"}

                            </strong>

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

                            <span
                              className={`badge ${status.className}`}
                            >

                              {status.text}

                            </span>

                          </td>

                        </tr>

                      )

                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}

    </div>

  )

}

export default StudentMyBooks