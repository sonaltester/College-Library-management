import { useEffect, useMemo, useState } from "react";
import { getBooks } from "../services/bookService";
import { getStudents } from "../services/studentService";
import { issueBook } from "../services/issueService";

function IssueBook() {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    book: "",
    student: ""
  });

  const [studentSearch, setStudentSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  const [showStudentResults, setShowStudentResults] = useState(false);
  const [showBookResults, setShowBookResults] = useState(false);

  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);

  // =========================
  // DATE FUNCTIONS
  // =========================

  const getToday = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getDueDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    date.setDate(date.getDate() + 14);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [issueDate, setIssueDate] = useState(getToday());
  const [dueDate, setDueDate] = useState(getDueDate(getToday()));

  // =========================
  // LOAD BOOKS & STUDENTS
  // =========================

  const loadData = async () => {
    try {
      setLoading(true);

      const [booksData, studentsData] = await Promise.all([
        getBooks(),
        getStudents()
      ]);

      setBooks(Array.isArray(booksData) ? booksData : []);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
    } catch (error) {
      console.error("Failed to load issue data:", error);

      alert(
        error.response?.data?.message ||
        "Unable to load books and students"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // ACTIVE STUDENTS
  // =========================

  const activeStudents = useMemo(() => {
    return students.filter(
      (student) => student.status !== "Inactive"
    );
  }, [students]);

  // =========================
  // AVAILABLE BOOKS
  // =========================

  const availableBooks = useMemo(() => {
    return books.filter(
      (book) => Number(book.availableQuantity) > 0
    );
  }, [books]);

  // =========================
  // SELECTED STUDENT
  // =========================

  const selectedStudent = useMemo(() => {
    return students.find(
      (student) => student._id === formData.student
    );
  }, [students, formData.student]);

  // =========================
  // SELECTED BOOK
  // =========================

  const selectedBook = useMemo(() => {
    return books.find(
      (book) => book._id === formData.book
    );
  }, [books, formData.book]);

  // =========================
  // STUDENT SEARCH
  // =========================

  const filteredStudents = useMemo(() => {
    const search = studentSearch.trim().toLowerCase();

    if (!search) {
      return activeStudents.slice(0, 10);
    }

    return activeStudents
      .filter((student) => {
        const name = student.name?.toLowerCase() || "";
        const enrollment =
          student.enrollmentNo?.toLowerCase() || "";
        const email =
          student.email?.toLowerCase() || "";

        return (
          name.includes(search) ||
          enrollment.includes(search) ||
          email.includes(search)
        );
      })
      .slice(0, 10);
  }, [studentSearch, activeStudents]);

  // =========================
  // BOOK SEARCH
  // =========================

  const filteredBooks = useMemo(() => {
    const search = bookSearch.trim().toLowerCase();

    if (!search) {
      return availableBooks.slice(0, 10);
    }

    return availableBooks
      .filter((book) => {
        const bookId =
          book.bookId?.toLowerCase() || "";

        const isbn =
          book.isbn?.toLowerCase() || "";

        const title =
          book.title?.toLowerCase() || "";

        const author =
          book.author?.toLowerCase() || "";

        const subject =
          book.subject?.toLowerCase() || "";

        const publisher =
          book.publisher?.toLowerCase() || "";

        const shelf =
          book.shelfNumber?.toLowerCase() || "";

        return (
          bookId.includes(search) ||
          isbn.includes(search) ||
          title.includes(search) ||
          author.includes(search) ||
          subject.includes(search) ||
          publisher.includes(search) ||
          shelf.includes(search)
        );
      })
      .slice(0, 10);
  }, [bookSearch, availableBooks]);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================
  // SELECT STUDENT
  // =========================

  const handleStudentSelect = (student) => {
    setFormData((prev) => ({
      ...prev,
      student: student._id
    }));

    setStudentSearch("");
    setShowStudentResults(false);
  };

  // =========================
  // SELECT BOOK
  // =========================

  const handleBookSelect = (book) => {
    setFormData((prev) => ({
      ...prev,
      book: book._id
    }));

    setBookSearch("");
    setShowBookResults(false);
  };

  // =========================
  // CLEAR STUDENT
  // =========================

  const clearStudent = () => {
    setFormData((prev) => ({
      ...prev,
      student: ""
    }));

    setStudentSearch("");
    setShowStudentResults(false);
  };

  // =========================
  // CLEAR BOOK
  // =========================

  const clearBook = () => {
    setFormData((prev) => ({
      ...prev,
      book: ""
    }));

    setBookSearch("");
    setShowBookResults(false);
  };

  // =========================
  // ISSUE DATE CHANGE
  // =========================

  const handleIssueDateChange = (e) => {
    const newIssueDate = e.target.value;

    setIssueDate(newIssueDate);

    if (newIssueDate) {
      setDueDate(getDueDate(newIssueDate));
    }
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  // =========================
  // RESET
  // =========================

  const handleReset = () => {
    setFormData({
      book: "",
      student: ""
    });

    setStudentSearch("");
    setBookSearch("");

    setShowStudentResults(false);
    setShowBookResults(false);

    const today = getToday();

    setIssueDate(today);
    setDueDate(getDueDate(today));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.student) {
      alert("Please select a student");
      return;
    }

    if (!formData.book) {
      alert("Please select a book");
      return;
    }

    if (!issueDate) {
      alert("Please select issue date");
      return;
    }

    if (!dueDate) {
      alert("Please select due date");
      return;
    }

    if (selectedStudent?.status === "Inactive") {
      alert("Inactive student cannot issue a book");
      return;
    }

    if (
      !selectedBook ||
      Number(selectedBook.availableQuantity) <= 0
    ) {
      alert("Selected book is not available");
      return;
    }

    try {
      setIssuing(true);

      await issueBook({
        book: formData.book,
        student: formData.student,
        issueDate,
        dueDate
      });

      alert("Book issued successfully!");

      handleReset();

      await loadData();
    } catch (error) {
      console.error("ISSUE BOOK ERROR:", error);

      alert(
        error.response?.data?.message ||
        "Failed to issue book"
      );
    } finally {
      setIssuing(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <span className="ms-3 text-muted">
            Loading books and students...
          </span>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="container-fluid p-4">

      <div className="mb-4">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center bg-primary bg-opacity-10"
            style={{
              width: "45px",
              height: "45px"
            }}
          >
            <i className="bi bi-journal-arrow-up text-primary fs-4"></i>
          </div>

          <div>
            <h3 className="fw-bold mb-1">
              Issue Book
            </h3>

            <p className="text-muted mb-0">
              Issue a library book to an active student
            </p>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">

        <div className="card-body p-4">

          <form onSubmit={handleSubmit}>

            {/* STUDENT */}

            <div className="mb-4">

              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-person text-primary fs-5 me-2"></i>

                <h5 className="fw-bold mb-0">
                  Student Details
                </h5>
              </div>

              {!selectedStudent ? (

                <div className="position-relative">

                  <label className="form-label fw-semibold">
                    Search Student
                  </label>

                  <div className="input-group">

                    <span className="input-group-text bg-white">
                      <i className="bi bi-search"></i>
                    </span>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, enrollment number or email..."
                      value={studentSearch}
                      onChange={(e) => {
                        setStudentSearch(e.target.value);
                        setShowStudentResults(true);
                      }}
                      onFocus={() =>
                        setShowStudentResults(true)
                      }
                    />

                  </div>

                  {showStudentResults && (
                    <div
                      className="position-absolute bg-white border rounded shadow-sm w-100 mt-1"
                      style={{
                        zIndex: 1000,
                        maxHeight: "300px",
                        overflowY: "auto"
                      }}
                    >

                      {filteredStudents.length > 0 ? (

                        filteredStudents.map((student) => (

                          <button
                            type="button"
                            key={student._id}
                            className="btn btn-light w-100 text-start border-0 rounded-0 p-3"
                            onClick={() =>
                              handleStudentSelect(student)
                            }
                          >

                            <div className="d-flex align-items-center">

                              <div
                                className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                                style={{
                                  width: "40px",
                                  height: "40px"
                                }}
                              >
                                <i className="bi bi-person text-primary"></i>
                              </div>

                              <div className="flex-grow-1">

                                <div className="fw-semibold">
                                  {student.name}
                                </div>

                                <small className="text-muted">
                                  {student.enrollmentNo}
                                  {" • "}
                                  {student.email}
                                </small>

                              </div>

                              <span className="badge bg-success">
                                Active
                              </span>

                            </div>

                          </button>

                        ))

                      ) : (

                        <div className="p-3 text-center text-muted">
                          No active student found
                        </div>

                      )}

                    </div>
                  )}

                  <small className="text-muted">
                    Search and select the student who will receive the book.
                  </small>

                </div>

              ) : (

                <div className="border rounded-3 p-3 bg-light">

                  <div className="d-flex align-items-center">

                    <div
                      className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "50px",
                        height: "50px"
                      }}
                    >
                      <i className="bi bi-person-fill text-primary fs-5"></i>
                    </div>

                    <div className="flex-grow-1">

                      <div className="fw-bold">
                        {selectedStudent.name}
                      </div>

                      <div className="small text-muted">
                        Enrollment:{" "}
                        {selectedStudent.enrollmentNo}
                      </div>

                      <div className="small text-muted">
                        {selectedStudent.email}
                      </div>

                    </div>

                    <div className="text-end">

                      <span className="badge bg-success mb-2">
                        Active
                      </span>

                      <br />

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={clearStudent}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Change
                      </button>

                    </div>

                  </div>

                </div>

              )}

            </div>

            <hr className="my-4" />

            {/* BOOK */}

            <div className="mb-4">

              <div className="d-flex align-items-center mb-3">

                <i className="bi bi-book text-primary fs-5 me-2"></i>

                <h5 className="fw-bold mb-0">
                  Book Details
                </h5>

              </div>

              {!selectedBook ? (

                <div className="position-relative">

                  <label className="form-label fw-semibold">
                    Search Book
                  </label>

                  <div className="input-group">

                    <span className="input-group-text bg-white">
                      <i className="bi bi-search"></i>
                    </span>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Book ID, ISBN, title, author, subject..."
                      value={bookSearch}
                      onChange={(e) => {
                        setBookSearch(e.target.value);
                        setShowBookResults(true);
                      }}
                      onFocus={() =>
                        setShowBookResults(true)
                      }
                    />

                  </div>

                  {showBookResults && (
                    <div
                      className="position-absolute bg-white border rounded shadow-sm w-100 mt-1"
                      style={{
                        zIndex: 1000,
                        maxHeight: "300px",
                        overflowY: "auto"
                      }}
                    >

                      {filteredBooks.length > 0 ? (

                        filteredBooks.map((book) => (

                          <button
                            type="button"
                            key={book._id}
                            className="btn btn-light w-100 text-start border-0 rounded-0 p-3"
                            onClick={() =>
                              handleBookSelect(book)
                            }
                          >

                            <div className="d-flex align-items-center">

                              <div
                                className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                                style={{
                                  width: "45px",
                                  height: "45px"
                                }}
                              >
                                <i className="bi bi-book text-primary"></i>
                              </div>

                              <div className="flex-grow-1">

                                <div className="fw-semibold">
                                  {book.title}
                                </div>

                                <small className="text-muted">
                                  ID: {book.bookId || "—"}
                                  {" • "}
                                  {book.author || "—"}
                                </small>

                                <div className="small text-muted">
                                  Subject: {book.subject || "—"}
                                </div>

                              </div>

                              <span className="badge bg-success">
                                {book.availableQuantity} Available
                              </span>

                            </div>

                          </button>

                        ))

                      ) : (

                        <div className="p-3 text-center text-muted">
                          No available book found
                        </div>

                      )}

                    </div>
                  )}

                  <small className="text-muted">
                    Search by Book ID, ISBN, title, author, subject, publisher or shelf.
                  </small>

                </div>

              ) : (

                <div className="border rounded-3 p-3 bg-light">

                  <div className="d-flex align-items-center">

                    <div
                      className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "55px",
                        height: "55px"
                      }}
                    >
                      <i className="bi bi-book-fill text-primary fs-5"></i>
                    </div>

                    <div className="flex-grow-1">

                      <div className="fw-bold">
                        {selectedBook.title}
                      </div>

                      <div className="small text-muted">
                        Book ID: {selectedBook.bookId || "—"}
                      </div>

                      <div className="small text-muted">
                        ISBN: {selectedBook.isbn || "—"}
                      </div>

                      <div className="small text-muted">
                        Author: {selectedBook.author || "—"}
                      </div>

                      <div className="small text-muted">
                        Subject: {selectedBook.subject || "—"}
                      </div>

                      <div className="small text-muted">
                        Shelf: {selectedBook.shelfNumber || "—"}
                      </div>

                    </div>

                    <div className="text-end">

                      <span className="badge bg-success mb-2">
                        {selectedBook.availableQuantity} Available
                      </span>

                      <br />

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={clearBook}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Change
                      </button>

                    </div>

                  </div>

                </div>

              )}

            </div>

            <hr className="my-4" />

            {/* DATES */}

            <div className="mb-4">

              <div className="d-flex align-items-center mb-3">

                <i className="bi bi-calendar3 text-primary fs-5 me-2"></i>

                <h5 className="fw-bold mb-0">
                  Issue Information
                </h5>

              </div>

              <div className="row g-4">

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Issue Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={issueDate}
                    onChange={handleIssueDateChange}
                  />

                  <small className="text-muted">
                    Default: Current Date. You can change it.
                  </small>

                  {issueDate && (
                    <div className="mt-2 small text-primary fw-semibold">
                      Selected: {formatDate(issueDate)}
                    </div>
                  )}

                </div>

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Due Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(e.target.value)
                    }
                  />

                  <small className="text-muted">
                    Default: Issue Date + 14 Days. You can change it.
                  </small>

                  {dueDate && (
                    <div className="mt-2 small text-danger fw-semibold">
                      Selected: {formatDate(dueDate)}
                    </div>
                  )}

                </div>

              </div>

            </div>

            <div className="alert alert-info border-0">

              <div className="d-flex">

                <i className="bi bi-info-circle-fill me-2 mt-1"></i>

                <div>

                  <strong>Fine Policy</strong>

                  <div className="small mt-1">
                    If the book is returned after the Due Date,
                    a fine of ₹5 per late day will be calculated automatically.
                  </div>

                </div>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="d-flex justify-content-end gap-2 mt-4">

              <button
                type="button"
                className="btn btn-light border px-4"
                onClick={handleReset}
                disabled={issuing}
              >
                <i className="bi bi-arrow-counterclockwise me-2"></i>
                Reset
              </button>

              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={
                  issuing ||
                  !formData.student ||
                  !formData.book
                }
              >

                {issuing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                    ></span>

                    Issuing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-journal-arrow-up me-2"></i>
                    Issue Book
                  </>
                )}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default IssueBook;