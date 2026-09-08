import { useEffect, useState } from "react"
import axios from "axios"

function StudentBooks() {

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [subject, setSubject] = useState("All")


  // ==============================
  // LOAD BOOKS
  // ==============================

  useEffect(() => {

    const loadBooks = async () => {

      try {

        setLoading(true)
        setError("")

        const response = await axios.get(
          "http://localhost:5000/api/books"
        )

        console.log("Books received:", response.data)

        setBooks(response.data)

      } catch (error) {

        console.error(
          "Student Books Error:",
          error
        )

        setError(
          "Unable to load books. Please try again."
        )

      } finally {

        setLoading(false)

      }

    }

    loadBooks()

  }, [])


  // ==============================
  // GET SUBJECTS
  // ==============================

  const subjects = [
    "All",
    ...new Set(
      books
        .map((book) => book.subject)
        .filter(Boolean)
    )
  ]


  // ==============================
  // TOTAL AVAILABLE BOOKS
  // ==============================

  const totalAvailable = books.reduce(
    (total, book) => {

      return (
        total +
        Number(book.availableQuantity || 0)
      )

    },
    0
  )


  // ==============================
  // FILTER BOOKS
  // ==============================

  const filteredBooks = books.filter(
    (book) => {

      const title =
        book.title || ""

      const author =
        book.author || ""

      const bookSubject =
        book.subject || ""


      const searchText =
        search.toLowerCase()


      const matchesSearch =
        title
          .toLowerCase()
          .includes(searchText) ||

        author
          .toLowerCase()
          .includes(searchText)


      const matchesSubject =
        subject === "All" ||
        bookSubject === subject


      return (
        matchesSearch &&
        matchesSubject
      )

    }
  )


  // ==============================
  // UI
  // ==============================

  return (

    <div className="container-fluid p-4">


      {/* =========================
          HEADER
      ========================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold mb-1">
            📚 Library Books
          </h2>

          <p className="text-muted mb-0">
            Browse books available in the library
          </p>

        </div>


        <span className="badge bg-primary fs-6 px-3 py-2">

          Available: {totalAvailable}

        </span>

      </div>


      {/* =========================
          SEARCH + SUBJECT
      ========================== */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <div className="row g-3">


            {/* SEARCH */}

            <div className="col-md-8">

              <div className="input-group">

                <span className="input-group-text">
                  🔍
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search books..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>


            {/* SUBJECT FILTER */}

            <div className="col-md-4">

              <select
                className="form-select"
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
              >

                {subjects.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>

        </div>

      </div>


      {/* =========================
          LOADING
      ========================== */}

      {loading && (

        <div className="text-center p-5">

          <div
            className="spinner-border text-primary"
            role="status"
          >
          </div>

          <p className="text-muted mt-3">
            Loading books...
          </p>

        </div>

      )}


      {/* =========================
          ERROR
      ========================== */}

      {!loading && error && (

        <div className="alert alert-danger">

          {error}

        </div>

      )}


      {/* =========================
          NO BOOKS
      ========================== */}

      {!loading &&
        !error &&
        filteredBooks.length === 0 && (

          <div className="alert alert-info">

            {books.length === 0
              ? "No books available in the library."
              : "No books found matching your search."}

          </div>

        )}


      {/* =========================
          BOOK CARDS
      ========================== */}

      {!loading &&
        !error &&
        filteredBooks.length > 0 && (

          <div className="row g-4">

            {filteredBooks.map(
              (book) => {

                const available =
                  Number(
                    book.availableQuantity || 0
                  )

                const quantity =
                  Number(
                    book.quantity || 0
                  )


                return (

                  <div
                    className="col-md-6 col-lg-4"
                    key={book._id}
                  >

                    <div className="card h-100 shadow-sm border-0">


                      <div className="card-body">


                        {/* BOOK HEADER */}

                        <div className="d-flex align-items-center mb-3">

                          <div
                            className="bg-light rounded p-3 me-3"
                            style={{
                              fontSize: "30px"
                            }}
                          >
                            📘
                          </div>


                          <div>

                            <h5 className="fw-bold mb-1">

                              {book.title}

                            </h5>

                            <small className="text-muted">

                              Book ID:{" "}

                              {book.bookId || "-"}

                            </small>

                          </div>

                        </div>


                        {/* AUTHOR */}

                        <p className="mb-2">

                          <strong>
                            Author:
                          </strong>{" "}

                          {book.author || "-"}

                        </p>


                        {/* SUBJECT */}

                        <p className="mb-2">

                          <strong>
                            Subject:
                          </strong>{" "}

                          <span className="badge bg-secondary">

                            {book.subject || "-"}

                          </span>

                        </p>


                        {/* PUBLISHER */}

                        {book.publisher && (

                          <p className="mb-2">

                            <strong>
                              Publisher:
                            </strong>{" "}

                            {book.publisher}

                          </p>

                        )}


                        {/* LANGUAGE */}

                        {book.language && (

                          <p className="mb-2">

                            <strong>
                              Language:
                            </strong>{" "}

                            {book.language}

                          </p>

                        )}


                        {/* AVAILABLE */}

                        <p className="mb-3">

                          <strong>
                            Available:
                          </strong>{" "}

                          {available} / {quantity}

                        </p>


                        {/* STATUS */}

                        {available > 0 ? (

                          <span className="badge bg-success px-3 py-2">

                            ✓ Available

                          </span>

                        ) : (

                          <span className="badge bg-danger px-3 py-2">

                            ✕ Not Available

                          </span>

                        )}

                      </div>

                    </div>

                  </div>

                )

              }
            )}

          </div>

        )}

    </div>

  )

}

export default StudentBooks

