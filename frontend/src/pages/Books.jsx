import { useEffect, useState } from "react"
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook
} from "../services/bookService"

function Books() {

  const [books, setBooks] = useState([])

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    quantity: ""
  })

  const loadBooks = async () => {

    try {

      const data = await getBooks()

      setBooks(data)

    } catch (error) {

      console.error("Failed to load books:", error)

    }
  }

  useEffect(() => {
    loadBooks()
  }, [])

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const resetForm = () => {

    setFormData({
      title: "",
      author: "",
      category: "",
      quantity: ""
    })

    setEditId(null)
    setShowForm(false)

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const data = {
        ...formData,
        quantity: Number(formData.quantity)
      }

      if (editId) {

        await updateBook(editId, data)

        alert("Book updated successfully")

      } else {

        await createBook(data)

        alert("Book added successfully")

      }

      resetForm()
      loadBooks()

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Operation failed"
      )

    }
  }

  const handleEdit = (book) => {

    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      quantity: book.quantity
    })

    setEditId(book._id)
    setShowForm(true)

  }

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this book?")) {
      return
    }

    try {

      await deleteBook(id)

      alert("Book deleted successfully")

      loadBooks()

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Delete failed"
      )

    }
  }

  const categories = [
    ...new Set(
      books.map((book) => book.category)
    )
  ]

  const filteredBooks = books.filter((book) => {

    const text =
      `${book.title} ${book.author} ${book.category}`
        .toLowerCase()

    const matchesSearch =
      text.includes(search.toLowerCase())

    const matchesCategory =
      categoryFilter === "All" ||
      book.category === categoryFilter

    return matchesSearch && matchesCategory

  })

  return (

    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h3 className="mb-1">
            Books Management
          </h3>

          <small className="text-muted">
            Manage library books
          </small>

        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          <i className="bi bi-plus-lg"></i>
          {" "}Add Book
        </button>

      </div>


      {/* Search & Filter */}

      <div className="card shadow-sm border-0 p-4 mb-4">

        <div className="row g-3">

          <div className="col-md-8">

            <label className="form-label">
              Search Books
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Search by title, author or category..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="col-md-4">

            <label className="form-label">
              Category
            </label>

            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
            >

              <option value="All">
                All Categories
              </option>

              {categories.map((category) => (

                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>

              ))}

            </select>

          </div>

        </div>

      </div>


      {/* Add / Edit Form */}

      {showForm && (

        <div className="card shadow-sm border-0 p-4 mb-4">

          <h5 className="mb-3">

            {editId
              ? "Edit Book"
              : "Add New Book"}

          </h5>

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              <div className="col-md-6">

                <label className="form-label">
                  Book Title
                </label>

                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="col-md-6">

                <label className="form-label">
                  Author
                </label>

                <input
                  type="text"
                  name="author"
                  className="form-control"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="col-md-6">

                <label className="form-label">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="col-md-6">

                <label className="form-label">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="mt-3">

              <button
                type="submit"
                className="btn btn-success me-2"
              >
                {editId
                  ? "Update Book"
                  : "Save Book"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* Books Table */}

      <div className="card shadow-sm border-0 p-4">

        <div className="d-flex justify-content-between mb-3">

          <h5>
            Book List
          </h5>

          <span className="badge bg-primary fs-6">
            {filteredBooks.length} Books
          </span>

        </div>


        <div className="table-responsive">

          <table className="table table-hover align-middle">

            <thead className="table-dark">

              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Available</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {filteredBooks.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center text-muted py-4"
                  >
                    No books found
                  </td>

                </tr>

              ) : (

                filteredBooks.map((book, index) => (

                  <tr key={book._id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>
                      <strong>
                        {book.title}
                      </strong>
                    </td>

                    <td>
                      {book.author}
                    </td>

                    <td>
                      <span className="badge bg-info text-dark">
                        {book.category}
                      </span>
                    </td>

                    <td>
                      {book.quantity}
                    </td>

                    <td>

                      <span
                        className={
                          book.availableQuantity > 0
                            ? "badge bg-success"
                            : "badge bg-danger"
                        }
                      >
                        {book.availableQuantity}
                      </span>

                    </td>

                    <td>

                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() =>
                          handleEdit(book)
                        }
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          handleDelete(book._id)
                        }
                      >
                        <i className="bi bi-trash"></i>
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )
}

export default Books
