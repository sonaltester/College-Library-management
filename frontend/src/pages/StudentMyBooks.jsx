
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

      <h2 className="mb-4">
        My Issued Books
      </h2>

      <p className="text-muted">
        View your issued and returned books
      </p>

      {loading ? (

        <p>Loading...</p>

      ) : books.length === 0 ? (

        <div className="alert alert-info">
          No books issued to you.
        </div>

      ) : (

        <div className="card shadow-sm border-0">

          <div className="card-body">

            <h5 className="mb-3">
              <strong>{books.length} Books</strong>
            </h5>

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>

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
                    (issue, index) => (

                      <tr key={issue._id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <strong>
                            {issue.book?.title ||
                              issue.bookName ||
                              "Book"}
                          </strong>
                        </td>

                        <td>
                          {formatDate(issue.issueDate)}
                        </td>

                        <td>
                          {formatDate(issue.dueDate)}
                        </td>

                        <td>

                          <span
                            className={
                              issue.returnDate
                                ? "badge bg-success"
                                : "badge bg-warning text-dark"
                            }
                          >

                            {issue.returnDate
                              ? "Returned"
                              : "Issued"}

                          </span>

                        </td>

                      </tr>

                    )
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

