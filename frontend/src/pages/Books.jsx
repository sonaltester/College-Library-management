import { useEffect, useMemo, useState } from "react";

import {
  getBooks,
  createBook,
  updateBook,
  deleteBook
} from "../services/bookService";


function Books() {

  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({

    isbn: "",
    title: "",
    author: "",
    subject: "",
    publisher: "",
    edition: "",
    language: "English",
    publicationYear: "",
    price: "",
    shelfNumber: "",
    description: "",
    quantity: ""

  });


  // ==========================================
  // LOAD BOOKS
  // ==========================================

  const loadBooks = async () => {

    try {

      setLoading(true);

      const data = await getBooks();

      setBooks(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load books:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadBooks();

  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData(
      prev => ({
        ...prev,
        [name]: value
      })
    );

  };


  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {

    setFormData({

      isbn: "",
      title: "",
      author: "",
      subject: "",
      publisher: "",
      edition: "",
      language: "English",
      publicationYear: "",
      price: "",
      shelfNumber: "",
      description: "",
      quantity: ""

    });

    setEditId(null);

    setShowForm(false);

  };


  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {

    setFormData({

      isbn: "",
      title: "",
      author: "",
      subject: "",
      publisher: "",
      edition: "",
      language: "English",
      publicationYear: "",
      price: "",
      shelfNumber: "",
      description: "",
      quantity: ""

    });

    setEditId(null);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // ==========================================
  // SAVE / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);


      const data = {

        isbn:
          formData.isbn.trim(),

        title:
          formData.title.trim(),

        author:
          formData.author.trim(),

        subject:
          formData.subject.trim(),

        publisher:
          formData.publisher.trim(),

        edition:
          formData.edition.trim(),

        language:
          formData.language,

        publicationYear:
          formData.publicationYear
            ? Number(formData.publicationYear)
            : "",

        price:
          formData.price
            ? Number(formData.price)
            : 0,

        shelfNumber:
          formData.shelfNumber.trim(),

        description:
          formData.description.trim(),

        quantity:
          Number(formData.quantity)

      };


      if (editId) {

        await updateBook(
          editId,
          data
        );

        alert(
          "Book updated successfully"
        );

      } else {

        await createBook(data);

        alert(
          "Book added successfully"
        );

      }


      resetForm();

      await loadBooks();


    } catch (error) {

      console.error(
        "Book Save Error:",
        error
      );

      alert(

        error.response?.data?.message ||

        "Unable to save book"

      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // EDIT BOOK
  // ==========================================

  const handleEdit = (book) => {

    setFormData({

      isbn:
        book.isbn || "",

      title:
        book.title || "",

      author:
        book.author || "",

      subject:
        book.subject || "",

      publisher:
        book.publisher || "",

      edition:
        book.edition || "",

      language:
        book.language || "English",

      publicationYear:
        book.publicationYear || "",

      price:
        book.price ?? "",

      shelfNumber:
        book.shelfNumber || "",

      description:
        book.description || "",

      quantity:
        book.quantity || ""

    });


    setEditId(
      book._id
    );

    setShowForm(true);


    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  };


  // ==========================================
  // DELETE BOOK
  // ==========================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(

        "Are you sure you want to delete this book?\n\nRelated issue records will also be removed."

      );


    if (!confirmed) {
      return;
    }


    try {

      setLoading(true);


      await deleteBook(id);


      alert(
        "Book deleted successfully"
      );


      await loadBooks();


    } catch (error) {

      console.error(
        "Delete Error:",
        error
      );

      alert(

        error.response?.data?.message ||

        "Unable to delete book"

      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // SUBJECT LIST
  // ==========================================

  const subjects = useMemo(() => {

    return [
      ...new Set(

        books

          .map(
            book => book.subject
          )

          .filter(Boolean)

      )
    ].sort();

  }, [books]);


  // ==========================================
  // FILTER BOOKS
  // ==========================================

  const filteredBooks =
    books.filter(book => {


      const searchText = `

        ${book.bookId || ""}

        ${book.isbn || ""}

        ${book.title || ""}

        ${book.author || ""}

        ${book.subject || ""}

        ${book.publisher || ""}

        ${book.shelfNumber || ""}

      `.toLowerCase();


      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        );


      const matchesSubject =
        subjectFilter === "All" ||

        book.subject ===
        subjectFilter;


      const available =
        Number(
          book.availableQuantity || 0
        );


      const status =
        available > 0
          ? "Available"
          : "Out of Stock";


      const matchesStatus =
        statusFilter === "All" ||

        status === statusFilter;


      return (

        matchesSearch &&

        matchesSubject &&

        matchesStatus

      );

    });


  // ==========================================
  // DASHBOARD COUNTS
  // ==========================================

  const totalTitles =
    books.length;


  const totalCopies =
    books.reduce(

      (sum, book) =>

        sum +
        Number(
          book.quantity || 0
        ),

      0

    );


  const availableCopies =
    books.reduce(

      (sum, book) =>

        sum +
        Number(
          book.availableQuantity || 0
        ),

      0

    );


  const issuedCopies =
    Math.max(
      totalCopies -
      availableCopies,
      0
    );


  // ==========================================
  // UI
  // ==========================================

  return (

    <div
      className="container-fluid px-4 py-4"
      style={{
        background: "#f5f7fb",
        minHeight:
          "calc(100vh - 70px)"
      }}
    >


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <div className="d-flex align-items-center gap-3">

            <div
              className="rounded-3 d-flex align-items-center justify-content-center"
              style={{
                width: "48px",
                height: "48px",
                background: "#e8f0fe",
                color: "#2563eb"
              }}
            >

              <i className="bi bi-book-half fs-4"></i>

            </div>


            <div>

              <h3 className="fw-bold mb-1">
                Books Management
              </h3>

              <p className="text-muted mb-0">
                Manage library collection,
                inventory and availability
              </p>

            </div>

          </div>

        </div>


        <button
          className="btn btn-primary px-4 py-2 fw-semibold shadow-sm"
          onClick={openAddForm}
        >

          <i className="bi bi-plus-lg me-2"></i>

          Add New Book

        </button>

      </div>



      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="row g-3 mb-4">


        {/* TOTAL TITLES */}

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted fw-semibold">
                    TOTAL TITLES
                  </small>

                  <h3 className="fw-bold mt-2 mb-1">
                    {totalTitles}
                  </h3>

                  <small className="text-muted">
                    Different books
                  </small>

                </div>


                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    background: "#e8f0fe",
                    color: "#2563eb"
                  }}
                >

                  <i className="bi bi-book fs-4"></i>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* TOTAL COPIES */}

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted fw-semibold">
                    TOTAL COPIES
                  </small>

                  <h3 className="fw-bold mt-2 mb-1">
                    {totalCopies}
                  </h3>

                  <small className="text-muted">
                    Library inventory
                  </small>

                </div>


                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    background: "#e8f7ef",
                    color: "#198754"
                  }}
                >

                  <i className="bi bi-stack fs-4"></i>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* AVAILABLE */}

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted fw-semibold">
                    AVAILABLE
                  </small>

                  <h3 className="fw-bold mt-2 mb-1 text-success">
                    {availableCopies}
                  </h3>

                  <small className="text-muted">
                    Ready to issue
                  </small>

                </div>


                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    background: "#e8f7ef",
                    color: "#198754"
                  }}
                >

                  <i className="bi bi-check-circle fs-4"></i>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ISSUED */}

        <div className="col-xl-3 col-md-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <small className="text-muted fw-semibold">
                    ISSUED
                  </small>

                  <h3 className="fw-bold mt-2 mb-1 text-warning">
                    {issuedCopies}
                  </h3>

                  <small className="text-muted">
                    Currently issued
                  </small>

                </div>


                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    background: "#fff4df",
                    color: "#f59e0b"
                  }}
                >

                  <i className="bi bi-journal-arrow-up fs-4"></i>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>



      {/* ======================================
          ADD / EDIT FORM
      ====================================== */}

      {showForm && (

        <div className="card border-0 shadow-sm mb-4">


          <div className="card-header bg-white p-4">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h5 className="fw-bold mb-1">

                  <i className="bi bi-book me-2 text-primary"></i>

                  {editId
                    ? "Edit Book"
                    : "Add New Book"}

                </h5>

                <small className="text-muted">
                  Enter complete book information
                </small>

              </div>


              <button
                type="button"
                className="btn btn-light border"
                onClick={resetForm}
              >

                <i className="bi bi-x-lg"></i>

              </button>

            </div>

          </div>


          <div className="card-body p-4">

            <form onSubmit={handleSubmit}>


              <div className="row g-3">


                {/* ISBN */}

                <div className="col-lg-4 col-md-6">

                  <label className="form-label fw-semibold">
                    ISBN
                  </label>

                  <input
                    type="text"
                    name="isbn"
                    className="form-control"
                    placeholder="978-XXXXXXXXXX"
                    value={formData.isbn}
                    onChange={handleChange}
                  />

                </div>


                {/* TITLE */}

                <div className="col-lg-8 col-md-6">

                  <label className="form-label fw-semibold">
                    Book Title
                    <span className="text-danger ms-1">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* AUTHOR */}

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Author
                    <span className="text-danger ms-1">*</span>
                  </label>

                  <input
                    type="text"
                    name="author"
                    className="form-control"
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* SUBJECT */}

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Subject
                    <span className="text-danger ms-1">*</span>
                  </label>

                  <input
                    type="text"
                    name="subject"
                    className="form-control"
                    placeholder="e.g. Java Programming"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* PUBLISHER */}

                <div className="col-md-6">

                  <label className="form-label fw-semibold">
                    Publisher
                  </label>

                  <input
                    type="text"
                    name="publisher"
                    className="form-control"
                    placeholder="Enter publisher name"
                    value={formData.publisher}
                    onChange={handleChange}
                  />

                </div>


                {/* EDITION */}

                <div className="col-md-3">

                  <label className="form-label fw-semibold">
                    Edition
                  </label>

                  <input
                    type="text"
                    name="edition"
                    className="form-control"
                    placeholder="12th Edition"
                    value={formData.edition}
                    onChange={handleChange}
                  />

                </div>


                {/* LANGUAGE */}

                <div className="col-md-3">

                  <label className="form-label fw-semibold">
                    Language
                  </label>

                  <select
                    name="language"
                    className="form-select"
                    value={formData.language}
                    onChange={handleChange}
                  >

                    <option value="English">
                      English
                    </option>

                    <option value="Hindi">
                      Hindi
                    </option>

                    <option value="Gujarati">
                      Gujarati
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>


                {/* YEAR */}

                <div className="col-md-4">

                  <label className="form-label fw-semibold">
                    Publication Year
                  </label>

                  <input
                    type="number"
                    name="publicationYear"
                    className="form-control"
                    placeholder="2025"
                    min="1000"
                    max={new Date().getFullYear()}
                    value={formData.publicationYear}
                    onChange={handleChange}
                  />

                </div>


                {/* PRICE */}

                <div className="col-md-4">

                  <label className="form-label fw-semibold">
                    Price
                  </label>

                  <div className="input-group">

                    <span className="input-group-text">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                {/* SHELF */}

                <div className="col-md-4">

                  <label className="form-label fw-semibold">
                    Shelf Number
                  </label>

                  <input
                    type="text"
                    name="shelfNumber"
                    className="form-control"
                    placeholder="CS-A01"
                    value={formData.shelfNumber}
                    onChange={handleChange}
                  />

                </div>


                {/* QUANTITY */}

                <div className="col-md-4">

                  <label className="form-label fw-semibold">
                    Total Quantity
                    <span className="text-danger ms-1">*</span>
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    placeholder="Enter quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="col-md-8">

                  <label className="form-label fw-semibold">
                    Description
                  </label>

                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    placeholder="Enter short description about the book..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>

                </div>

              </div>


              {/* FORM BUTTONS */}

              <div className="border-top mt-4 pt-4">

                <button
                  type="submit"
                  className="btn btn-success px-4 me-2"
                  disabled={saving}
                >

                  {saving ? (

                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>

                  ) : (

                    <>
                      <i className="bi bi-check-lg me-2"></i>

                      {editId
                        ? "Update Book"
                        : "Save Book"}

                    </>

                  )}

                </button>


                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={resetForm}
                >

                  Cancel

                </button>

              </div>

            </form>

          </div>

        </div>

      )}



      {/* ======================================
          SEARCH & FILTER
      ====================================== */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <div className="row g-3 align-items-end">


            {/* SEARCH */}

            <div className="col-lg-6">

              <label className="form-label fw-semibold">
                Search Books
              </label>

              <div className="input-group">

                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Book ID, ISBN, title, author, subject..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>


            {/* SUBJECT */}

            <div className="col-lg-3">

              <label className="form-label fw-semibold">
                Subject
              </label>

              <select
                className="form-select"
                value={subjectFilter}
                onChange={(e) =>
                  setSubjectFilter(e.target.value)
                }
              >

                <option value="All">
                  All Subjects
                </option>

                {subjects.map(
                  subject => (

                    <option
                      key={subject}
                      value={subject}
                    >
                      {subject}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* STATUS */}

            <div className="col-lg-3">

              <label className="form-label fw-semibold">
                Availability
              </label>

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >

                <option value="All">
                  All Books
                </option>

                <option value="Available">
                  Available
                </option>

                <option value="Out of Stock">
                  Out of Stock
                </option>

              </select>

            </div>

          </div>

        </div>

      </div>



      {/* ======================================
          BOOK LIST
      ====================================== */}

      <div className="card border-0 shadow-sm">


        {/* TABLE HEADER */}

        <div className="card-header bg-white p-4">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h5 className="fw-bold mb-1">
                Library Collection
              </h5>

              <small className="text-muted">
                {filteredBooks.length} book
                {filteredBooks.length !== 1
                  ? "s"
                  : ""} found
              </small>

            </div>


            <span className="badge bg-primary px-3 py-2">

              {filteredBooks.length}

            </span>

          </div>

        </div>



        {/* TABLE */}

        <div className="table-responsive">

          <table
            className="table table-hover align-middle mb-0"
            style={{
              minWidth: "1250px"
            }}
          >


            <thead
              style={{
                background: "#172033",
                color: "white"
              }}
            >

              <tr>

                <th className="px-3 py-3">
                  #
                </th>

                <th>
                  Book Details
                </th>

                <th>
                  Author
                </th>

                <th>
                  Subject
                </th>

                <th>
                  Shelf
                </th>

                <th className="text-center">
                  Total
                </th>

                <th className="text-center">
                  Available
                </th>

                <th>
                  Status
                </th>

                <th className="text-center">
                  Action
                </th>

              </tr>

            </thead>



            <tbody>


              {/* LOADING */}

              {loading &&
              books.length === 0 ? (

                <tr>

                  <td
                    colSpan="9"
                    className="text-center py-5"
                  >

                    <div className="spinner-border text-primary"></div>

                    <div className="text-muted mt-2">
                      Loading books...
                    </div>

                  </td>

                </tr>

              ) : filteredBooks.length === 0 ? (


                /* NO DATA */

                <tr>

                  <td
                    colSpan="9"
                    className="text-center py-5"
                  >

                    <i
                      className="bi bi-journal-x text-muted"
                      style={{
                        fontSize: "42px"
                      }}
                    ></i>

                    <h6 className="mt-3">
                      No books found
                    </h6>

                    <small className="text-muted">
                      Add a new book or change your search/filter.
                    </small>

                  </td>

                </tr>


              ) : (


                /* BOOK RECORDS */

                filteredBooks.map(
                  (book, index) => {


                    const total =
                      Number(
                        book.quantity || 0
                      );


                    const available =
                      Number(
                        book.availableQuantity || 0
                      );


                    const issued =
                      Math.max(
                        total -
                        available,
                        0
                      );


                    const isAvailable =
                      available > 0;


                    return (

                      <tr
                        key={book._id}
                      >


                        {/* NUMBER */}

                        <td className="px-3 text-muted fw-semibold">

                          {index + 1}

                        </td>


                        {/* BOOK DETAILS */}

                        <td>

                          <div>

                            <div className="fw-bold text-dark">

                              {book.title || "Untitled Book"}

                            </div>


                            <div className="d-flex gap-2 flex-wrap mt-1">


                              {book.bookId && (

                                <span
                                  className="badge bg-primary-subtle text-primary"
                                >

                                  {book.bookId}

                                </span>

                              )}


                              {book.isbn && (

                                <small className="text-muted">

                                  ISBN:
                                  {" "}
                                  {book.isbn}

                                </small>

                              )}

                            </div>

                          </div>

                        </td>


                        {/* AUTHOR */}

                        <td>

                          <span className="fw-medium">

                            {book.author || "—"}

                          </span>

                        </td>


                        {/* SUBJECT */}

                        <td>

                          {book.subject ? (

                            <span
                              className="badge rounded-pill"
                              style={{
                                background: "#e0f2fe",
                                color: "#0369a1"
                              }}
                            >

                              {book.subject}

                            </span>

                          ) : (

                            <span className="text-muted">
                              —
                            </span>

                          )}

                        </td>


                        {/* SHELF */}

                        <td>

                          {book.shelfNumber ? (

                            <span className="fw-semibold">

                              <i className="bi bi-bookshelf me-1"></i>

                              {book.shelfNumber}

                            </span>

                          ) : (

                            <span className="text-muted">
                              —
                            </span>

                          )}

                        </td>


                        {/* TOTAL */}

                        <td className="text-center">

                          <span className="fw-bold">

                            {total}

                          </span>

                        </td>


                        {/* AVAILABLE */}

                        <td className="text-center">

                          <span
                            className={
                              available > 0

                                ? "badge bg-success rounded-pill px-3"

                                : "badge bg-danger rounded-pill px-3"
                            }
                          >

                            {available}

                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          {isAvailable ? (

                            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">

                              <i className="bi bi-check-circle me-1"></i>

                              Available

                            </span>

                          ) : (

                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">

                              <i className="bi bi-x-circle me-1"></i>

                              Out of Stock

                            </span>

                          )}


                          {issued > 0 && (

                            <div className="mt-1">

                              <small className="text-muted">

                                {issued} issued

                              </small>

                            </div>

                          )}

                        </td>


                        {/* ACTION */}

                        <td className="text-center">

                          <div className="btn-group">

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              title="Edit Book"
                              onClick={() =>
                                handleEdit(book)
                              }
                            >

                              <i className="bi bi-pencil"></i>

                            </button>


                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              title="Delete Book"
                              onClick={() =>
                                handleDelete(
                                  book._id
                                )
                              }
                            >

                              <i className="bi bi-trash"></i>

                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  }

                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}


export default Books;