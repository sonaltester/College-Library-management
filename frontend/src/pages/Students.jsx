import { useEffect, useState } from "react"
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from "../services/studentService"

function Students() {

  const [students, setStudents] = useState([])

  const [search, setSearch] = useState("")
  const [courseFilter, setCourseFilter] = useState("All")
  const [semesterFilter, setSemesterFilter] = useState("All")

  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    enrollmentNo: "",
    email: "",
    course: "",
    semester: "",
    phone: ""
  })

  const loadStudents = async () => {

    try {

      const data = await getStudents()

      setStudents(data)

    } catch (error) {

      console.error("Failed to load students:", error)

    }

  }

  useEffect(() => {
    loadStudents()
  }, [])

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const resetForm = () => {

    setFormData({
      name: "",
      enrollmentNo: "",
      email: "",
      course: "",
      semester: "",
      phone: ""
    })

    setEditId(null)
    setShowForm(false)

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const data = {
        ...formData,
        semester: Number(formData.semester)
      }

      if (editId) {

        await updateStudent(editId, data)

        alert("Student updated successfully")

      } else {

        await createStudent(data)

        alert("Student added successfully")

      }

      resetForm()
      loadStudents()

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Operation failed"
      )

    }

  }

  const handleEdit = (student) => {

    setFormData({
      name: student.name,
      enrollmentNo: student.enrollmentNo,
      email: student.email,
      course: student.course,
      semester: student.semester,
      phone: student.phone
    })

    setEditId(student._id)
    setShowForm(true)

  }

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this student?")) {
      return
    }

    try {

      await deleteStudent(id)

      alert("Student deleted successfully")

      loadStudents()

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Delete failed"
      )

    }

  }

  const courses = [
    ...new Set(
      students.map((student) => student.course)
    )
  ]

  const semesters = [
    ...new Set(
      students.map((student) => student.semester)
    )
  ].sort((a, b) => a - b)

  const filteredStudents = students.filter((student) => {

    const text =
      `${student.name} ${student.enrollmentNo} ${student.email} ${student.course}`
        .toLowerCase()

    const matchesSearch =
      text.includes(search.toLowerCase())

    const matchesCourse =
      courseFilter === "All" ||
      student.course === courseFilter

    const matchesSemester =
      semesterFilter === "All" ||
      String(student.semester) === String(semesterFilter)

    return (
      matchesSearch &&
      matchesCourse &&
      matchesSemester
    )

  })

  return (

    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h3 className="mb-1">
            Students Management
          </h3>

          <small className="text-muted">
            Manage college students
          </small>

        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          <i className="bi bi-person-plus"></i>
          {" "}Add Student
        </button>

      </div>


      {/* Search & Filters */}

      <div className="card shadow-sm border-0 p-4 mb-4">

        <div className="row g-3">

          <div className="col-md-6">

            <label className="form-label">
              Search Students
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Search name, enrollment, email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="col-md-3">

            <label className="form-label">
              Course
            </label>

            <select
              className="form-select"
              value={courseFilter}
              onChange={(e) =>
                setCourseFilter(e.target.value)
              }
            >

              <option value="All">
                All Courses
              </option>

              {courses.map((course) => (

                <option
                  key={course}
                  value={course}
                >
                  {course}
                </option>

              ))}

            </select>

          </div>


          <div className="col-md-3">

            <label className="form-label">
              Semester
            </label>

            <select
              className="form-select"
              value={semesterFilter}
              onChange={(e) =>
                setSemesterFilter(e.target.value)
              }
            >

              <option value="All">
                All Semesters
              </option>

              {semesters.map((semester) => (

                <option
                  key={semester}
                  value={semester}
                >
                  Semester {semester}
                </option>

              ))}

            </select>

          </div>

        </div>

      </div>


      {/* Add / Edit Student */}

      {showForm && (

        <div className="card shadow-sm border-0 p-4 mb-4">

          <h5 className="mb-3">

            {editId
              ? "Edit Student"
              : "Add New Student"}

          </h5>

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              <div className="col-md-6">

                <label className="form-label">
                  Student Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="col-md-6">

                <label className="form-label">
                  Enrollment Number
                </label>

                <input
                  type="text"
                  name="enrollmentNo"
                  className="form-control"
                  value={formData.enrollmentNo}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="col-md-6">

                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="col-md-6">

                <label className="form-label">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="col-md-6">

                <label className="form-label">
                  Course
                </label>

                <input
                  type="text"
                  name="course"
                  className="form-control"
                  placeholder="Example: MCA"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="col-md-6">

                <label className="form-label">
                  Semester
                </label>

                <input
                  type="number"
                  name="semester"
                  className="form-control"
                  min="1"
                  max="10"
                  value={formData.semester}
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
                  ? "Update Student"
                  : "Save Student"}
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


      {/* Student Table */}

      <div className="card shadow-sm border-0 p-4">

        <div className="d-flex justify-content-between mb-3">

          <h5>
            Student List
          </h5>

          <span className="badge bg-primary fs-6">
            {filteredStudents.length} Students
          </span>

        </div>


        <div className="table-responsive">

          <table className="table table-hover align-middle">

            <thead className="table-dark">

              <tr>

                <th>#</th>
                <th>Name</th>
                <th>Enrollment</th>
                <th>Email</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Phone</th>
                <th>Action</th>

              </tr>

            </thead>


            <tbody>

              {filteredStudents.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center text-muted py-4"
                  >
                    No students found
                  </td>

                </tr>

              ) : (

                filteredStudents.map(
                  (student, index) => (

                    <tr key={student._id}>

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        <strong>
                          {student.name}
                        </strong>
                      </td>

                      <td>
                        {student.enrollmentNo}
                      </td>

                      <td>
                        {student.email}
                      </td>

                      <td>

                        <span className="badge bg-info text-dark">
                          {student.course}
                        </span>

                      </td>

                      <td>
                        Semester {student.semester}
                      </td>

                      <td>
                        {student.phone}
                      </td>

                      <td>

                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() =>
                            handleEdit(student)
                          }
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDelete(student._id)
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )
}

export default Students
