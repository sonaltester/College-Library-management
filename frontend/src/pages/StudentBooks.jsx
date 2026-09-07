import { useEffect, useState } from "react"
import axios from "axios"

function StudentMyBooks() {

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const student = JSON.parse(
    localStorage.getItem("student")
  )

  useEffect(() => {

    const loadMyBooks = async () => {

      try {

        setLoading(true)

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

        console.error("My Books error:", error)

        setError("Unable to load your books")

      } finally {

        setLoading(false)

      }

    }

    loadMyBooks()

  }, [student?._id])


  const getStatus = (issue) => {

    if (issue.returnDate) {

      return {
        text: "Returned",
        className: "bg-success"
      }

    }

    if (
      issue.dueDate &&
      new Date(issue.dueDate) < new Date()
    ) {

      return {
        text: "Overdue",
        className: "bg-danger"
      }

    }

    return {
      text: "Issued",
      className: "bg-warning text-dark"
    }

  }


  return (

    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2>My Books</h2>

          <p className="text-muted mb-0">
            View your issued and returned books
          </p>

        </div>

        <span className="badge bg-primary fs-6">

          {books.length} Books

        </span>

      </div>


      {loading && (

        <div className="text-center p-5">

          Loading your books...

        </div>

      )}


      {error && (

        <div className="alert alert-danger">

          {error}

        </div>

      )}


      {!loading && !error && books.length === 0 && (

        <div className="alert alert-info">

          No books have been issued to you yet.

        </div>

      )}


      {!loading && !error && books.length > 0 && (

        <div className="card shadow-sm border-0">

          <div className="table-responsive">

            <table className="table table-hover mb-0">

              <thead className="table-dark">

                <tr>

                  <th>#</th>
                  <th>Book</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>

                </tr>

              </thead>


              <tbody>

                {books.map((issue, index) => {

                  const status = getStatus(issue)

                  return (

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

                        {issue.issueDate
                          ? new Date(
                              issue.issueDate
                            ).toLocaleDateString()
                          : "-"}

                      </td>

                      <td>

                        {issue.dueDate
                          ? new Date(
                              issue.dueDate
                            ).toLocaleDateString()
                          : "-"}

                      </td>

                      <td>

                        <span
                          className={`badge ${status.className}`}
                        >

                          {status.text}

                        </span>

                      </td>

                    </tr>

                  )

                })}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>

  )

}

export default StudentMyBooks