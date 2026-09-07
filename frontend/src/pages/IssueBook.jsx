import { useEffect, useState } from "react"
import { getBooks } from "../services/bookService"
import { getStudents } from "../services/studentService"
import { issueBook } from "../services/issueService"

function IssueBook() {

  const [books, setBooks] = useState([])
  const [students, setStudents] = useState([])

  const [formData, setFormData] = useState({
    book: "",
    student: "",
    issueDate: ""
  })

  const [dueDate, setDueDate] = useState("")


  // ================= FORMAT DATE =================

  const formatDate = (date) => {

    if (!date) return "-"

    const d = new Date(date)

    if (isNaN(d.getTime())) return "-"

    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()

    return `${day}/${month}/${year}`
  }


  // ================= CALCULATE DUE DATE =================

  const calculateDueDate = (date) => {

    if (!date) {
      setDueDate("")
      return
    }

    const due = new Date(date)

    due.setDate(due.getDate() + 7)

    const year = due.getFullYear()
    const month = String(due.getMonth() + 1).padStart(2, "0")
    const day = String(due.getDate()).padStart(2, "0")

    setDueDate(`${year}-${month}-${day}`)
  }


  // ================= LOAD DATA =================

  const loadData = async () => {

    try {

      const booksData = await getBooks()
      const studentsData = await getStudents()

      setBooks(booksData)
      setStudents(studentsData)

    } catch (error) {

      console.error("Failed to load data:", error)
    }
  }


  // ================= PAGE LOAD =================

  useEffect(() => {

    loadData()

    const today = new Date()

    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")

    const todayDate = `${year}-${month}-${day}`

    setFormData({
      book: "",
      student: "",
      issueDate: todayDate
    })

    calculateDueDate(todayDate)

  }, [])


  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })


    // Issue Date change hone par
    // Due Date automatically change hogi

    if (name === "issueDate") {

      calculateDueDate(value)
    }
  }


  // ================= SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault()


    if (!formData.book || !formData.student || !formData.issueDate) {

      alert("Please select book, student and issue date")

      return
    }


    try {

      await issueBook({
        book: formData.book,
        student: formData.student,
        issueDate: formData.issueDate
      })


      alert("Book issued successfully!")


      // Form reset

      const today = new Date()

      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const day = String(today.getDate()).padStart(2, "0")

      const todayDate = `${year}-${month}-${day}`


      setFormData({
        book: "",
        student: "",
        issueDate: todayDate
      })

      calculateDueDate(todayDate)


      // Refresh books
      loadData()

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to issue book"
      )
    }
  }


  return (

    <div className="container-fluid p-4">

      <div className="card shadow-sm border-0">

        <div className="card-body p-4">

          <h3 className="mb-1">
            Issue Book
          </h3>

          <p className="text-muted mb-4">
            Issue a library book to a student
          </p>


          <form onSubmit={handleSubmit}>

            <div className="row g-3">


              {/* ================= BOOK ================= */}

              <div className="col-md-6">

                <label className="form-label">
                  Select Book
                </label>

                <select
                  name="book"
                  className="form-select"
                  value={formData.book}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Book
                  </option>

                  {books.map((book) => (

                    <option
                      key={book._id}
                      value={book._id}
                      disabled={book.availableQuantity <= 0}
                    >

                      {book.title}
                      {" - Available: "}
                      {book.availableQuantity}

                    </option>

                  ))}

                </select>

              </div>


              {/* ================= STUDENT ================= */}

              <div className="col-md-6">

                <label className="form-label">
                  Select Student
                </label>

                <select
                  name="student"
                  className="form-select"
                  value={formData.student}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Student
                  </option>

                  {students.map((student) => (

                    <option
                      key={student._id}
                      value={student._id}
                    >

                      {student.name}
                      {" - "}
                      {student.enrollmentNo}

                    </option>

                  ))}

                </select>

              </div>


              {/* ================= ISSUE DATE ================= */}

              <div className="col-md-6">

                <label className="form-label">
                  Issue Date
                </label>

                <input
                  type="date"
                  name="issueDate"
                  className="form-control"
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                />

                <small className="text-muted">
                  Admin can select the issue date
                </small>

              </div>


              {/* ================= DUE DATE ================= */}

              <div className="col-md-6">

                <label className="form-label">
                  Due Date
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={formatDate(dueDate)}
                  readOnly
                />

                <small className="text-muted">
                  Automatically calculated as 7 days from issue date
                </small>

              </div>

            </div>


            {/* ================= BUTTON ================= */}

            <div className="mt-4">

              <button
                type="submit"
                className="btn btn-primary px-4"
              >

                <i className="bi bi-book"></i>
                {" "}
                Issue Book

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  )
}

export default IssueBook