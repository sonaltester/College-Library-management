import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/students";

  // ==========================================
  // FETCH STUDENTS
  // ==========================================
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      setStudents(response.data);
    } catch (err) {
      console.error("GET STUDENTS ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ==========================================
  // FILTER STUDENTS
  // ==========================================
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        student.name?.toLowerCase().includes(searchText) ||
        student.enrollmentNo?.toLowerCase().includes(searchText) ||
        student.email?.toLowerCase().includes(searchText);

      const matchesCourse =
        !courseFilter ||
        student.course === courseFilter;

      const matchesSemester =
        !semesterFilter ||
        String(student.semester) === semesterFilter;

      const matchesStatus =
        !statusFilter ||
        student.status === statusFilter;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesSemester &&
        matchesStatus
      );
    });
  }, [
    students,
    search,
    courseFilter,
    semesterFilter,
    statusFilter
  ]);

  // ==========================================
  // DELETE STUDENT
  // ==========================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);

      setMessage("Student deleted successfully.");
      setError("");

      fetchStudents();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error("DELETE STUDENT ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Unable to delete student"
      );
    }
  };

  // ==========================================
  // UPDATE STUDENT
  // ==========================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await axios.put(
        `${API_URL}/${editingStudent._id}`,
        {
          name: editingStudent.name,
          email: editingStudent.email,
          course: editingStudent.course,
          semester: Number(editingStudent.semester),
          phone: editingStudent.phone,
          status: editingStudent.status
        }
      );

      setMessage("Student updated successfully.");

      setEditingStudent(null);

      fetchStudents();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error("UPDATE STUDENT ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Unable to update student"
      );
    }
  };

  // ==========================================
  // STATUS
  // ==========================================
  const activeStudents = students.filter(
    (student) => student.status === "Active"
  ).length;

  const inactiveStudents = students.filter(
    (student) => student.status === "Inactive"
  ).length;

  const studentsWithBooks = students.filter(
    (student) =>
      Number(student.booksIssued || 0) > 0
  ).length;

  // ==========================================
  // RESET FILTERS
  // ==========================================
  const resetFilters = () => {
    setSearch("");
    setCourseFilter("");
    setSemesterFilter("");
    setStatusFilter("");
  };

  return (
    <div className="container-fluid p-4">

      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-people-fill me-2 text-primary"></i>
            Students
          </h2>

          <p className="text-muted mb-0">
            Manage registered students and their library accounts.
          </p>
        </div>

        <div className="mt-3 mt-md-0">
          <span className="badge bg-primary-subtle text-primary px-3 py-2">
            {students.length} Students
          </span>
        </div>
      </div>

      {/* ==========================================
          MESSAGE
      ========================================== */}
      {message && (
        <div className="alert alert-success border-0 shadow-sm">
          <i className="bi bi-check-circle-fill me-2"></i>
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger border-0 shadow-sm">
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}
      <div className="row g-3 mb-4">

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Total Students
                </small>

                <h3 className="fw-bold mb-0">
                  {students.length}
                </h3>
              </div>

              <div className="bg-primary-subtle text-primary rounded-circle p-3">
                <i className="bi bi-people-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Active Students
                </small>

                <h3 className="fw-bold mb-0 text-success">
                  {activeStudents}
                </h3>
              </div>

              <div className="bg-success-subtle text-success rounded-circle p-3">
                <i className="bi bi-person-check-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Inactive Students
                </small>

                <h3 className="fw-bold mb-0 text-danger">
                  {inactiveStudents}
                </h3>
              </div>

              <div className="bg-danger-subtle text-danger rounded-circle p-3">
                <i className="bi bi-person-x-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  With Books
                </small>

                <h3 className="fw-bold mb-0 text-warning">
                  {studentsWithBooks}
                </h3>
              </div>

              <div className="bg-warning-subtle text-warning rounded-circle p-3">
                <i className="bi bi-book-half fs-4"></i>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ==========================================
          SEARCH + FILTER
      ========================================== */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">

          <div className="row g-3">

            <div className="col-lg-4">
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
                  placeholder="Name, enrollment or email..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <label className="form-label fw-semibold">
                Course
              </label>

              <select
                className="form-select"
                value={courseFilter}
                onChange={(e) =>
                  setCourseFilter(e.target.value)
                }
              >
                <option value="">
                  All Courses
                </option>

                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="BBA">BBA</option>
                <option value="MBA">MBA</option>
                <option value="B.Com">B.Com</option>
                <option value="M.Com">M.Com</option>
                <option value="Ph.D">Ph.D</option>
              </select>
            </div>

            <div className="col-md-4 col-lg-2">
              <label className="form-label fw-semibold">
                Semester
              </label>

              <select
                className="form-select"
                value={semesterFilter}
                onChange={(e) =>
                  setSemesterFilter(e.target.value)
                }
              >
                <option value="">
                  All Semesters
                </option>

                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>

            <div className="col-md-4 col-lg-2">
              <label className="form-label fw-semibold">
                Status
              </label>

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>

            <div className="col-md-4 col-lg-2 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={resetFilters}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Reset
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ==========================================
          STUDENT TABLE
      ========================================== */}
      <div className="card border-0 shadow-sm">

        <div className="card-header bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">

            <div>
              <h5 className="fw-bold mb-1">
                Registered Students
              </h5>

              <small className="text-muted">
                Showing {filteredStudents.length} of{" "}
                {students.length} students
              </small>
            </div>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={fetchStudents}
            >
              <i className="bi bi-arrow-repeat me-1"></i>
              Refresh
            </button>

          </div>
        </div>

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead className="table-light">
              <tr>
                <th className="ps-4">#</th>
                <th>Student</th>
                <th>Enrollment No</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Contact</th>
                <th>Books</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-5"
                  >
                    <div className="spinner-border text-primary"></div>

                    <div className="mt-2 text-muted">
                      Loading students...
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-5"
                  >
                    <i className="bi bi-people fs-1 text-muted"></i>

                    <h5 className="mt-3">
                      No students found
                    </h5>

                    <p className="text-muted mb-0">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {

                  const booksIssued =
                    Number(student.booksIssued || 0);

                  return (
                    <tr key={student._id}>

                      <td className="ps-4">
                        {index + 1}
                      </td>

                      <td>
                        <div className="d-flex align-items-center">

                          <div
                            className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: "42px",
                              height: "42px"
                            }}
                          >
                            <i className="bi bi-person-fill"></i>
                          </div>

                          <div>
                            <div className="fw-semibold">
                              {student.name}
                            </div>

                            <small className="text-muted">
                              {student.email}
                            </small>
                          </div>

                        </div>
                      </td>

                      <td>
                        <span className="fw-semibold">
                          {student.enrollmentNo}
                        </span>
                      </td>

                      <td>
                        <span className="badge bg-light text-dark border">
                          {student.course}
                        </span>
                      </td>

                      <td>
                        Semester {student.semester}
                      </td>

                      <td>
                        <small>
                          <i className="bi bi-telephone me-1"></i>
                          {student.phone}
                        </small>
                      </td>

                      <td>
                        {booksIssued > 0 ? (
                          <span className="badge bg-warning-subtle text-warning">
                            <i className="bi bi-book me-1"></i>
                            {booksIssued}
                          </span>
                        ) : (
                          <span className="text-muted">
                            0
                          </span>
                        )}
                      </td>

                      <td>
                        {student.status === "Active" ? (
                          <span className="badge bg-success-subtle text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Active
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger">
                            <i className="bi bi-x-circle me-1"></i>
                            Inactive
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="d-flex justify-content-center gap-1">

                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="View Student"
                            onClick={() =>
                              setSelectedStudent(student)
                            }
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-outline-secondary"
                            title="Edit Student"
                            onClick={() =>
                              setEditingStudent({
                                ...student
                              })
                            }
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete Student"
                            onClick={() =>
                              handleDelete(student._id)
                            }
                          >
                            <i className="bi bi-trash"></i>
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* ==========================================
          VIEW STUDENT MODAL
      ========================================== */}
      {selectedStudent && (
        <div
          className="modal d-block"
          style={{
            background: "rgba(0,0,0,0.5)"
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">

            <div className="modal-content border-0 shadow">

              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-person-circle me-2 text-primary"></i>
                  Student Profile
                </h5>

                <button
                  className="btn-close"
                  onClick={() =>
                    setSelectedStudent(null)
                  }
                ></button>
              </div>

              <div className="modal-body">

                <div className="text-center mb-4">

                  <div
                    className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      width: "80px",
                      height: "80px"
                    }}
                  >
                    <i className="bi bi-person-fill fs-1"></i>
                  </div>

                  <h4 className="fw-bold mb-1">
                    {selectedStudent.name}
                  </h4>

                  <p className="text-muted mb-0">
                    {selectedStudent.enrollmentNo}
                  </p>

                </div>

                <div className="row g-3">

                  <div className="col-md-6">
                    <div className="bg-light rounded p-3">
                      <small className="text-muted">
                        Email
                      </small>

                      <div className="fw-semibold">
                        {selectedStudent.email}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="bg-light rounded p-3">
                      <small className="text-muted">
                        Phone
                      </small>

                      <div className="fw-semibold">
                        {selectedStudent.phone}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="bg-light rounded p-3">
                      <small className="text-muted">
                        Course
                      </small>

                      <div className="fw-semibold">
                        {selectedStudent.course}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="bg-light rounded p-3">
                      <small className="text-muted">
                        Semester
                      </small>

                      <div className="fw-semibold">
                        Semester {selectedStudent.semester}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="bg-light rounded p-3">
                      <small className="text-muted">
                        Books Issued
                      </small>

                      <div className="fw-semibold">
                        {selectedStudent.booksIssued || 0}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="bg-light rounded p-3">
                      <small className="text-muted">
                        Account Status
                      </small>

                      <div className="fw-semibold">
                        {selectedStudent.status}
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setSelectedStudent(null)
                  }
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          EDIT STUDENT MODAL
      ========================================== */}
      {editingStudent && (
        <div
          className="modal d-block"
          style={{
            background: "rgba(0,0,0,0.5)"
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">

            <div className="modal-content border-0 shadow">

              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil-square me-2 text-primary"></i>
                  Edit Student
                </h5>

                <button
                  className="btn-close"
                  onClick={() =>
                    setEditingStudent(null)
                  }
                ></button>
              </div>

              <form onSubmit={handleUpdate}>

                <div className="modal-body">

                  <div className="row g-3">

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Student Name
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={editingStudent.name}
                        onChange={(e) =>
                          setEditingStudent({
                            ...editingStudent,
                            name: e.target.value
                          })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Enrollment Number
                      </label>

                      <input
                        type="text"
                        className="form-control bg-light"
                        value={editingStudent.enrollmentNo}
                        disabled
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Email
                      </label>

                      <input
                        type="email"
                        className="form-control"
                        value={editingStudent.email}
                        onChange={(e) =>
                          setEditingStudent({
                            ...editingStudent,
                            email: e.target.value
                          })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Phone
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        maxLength="10"
                        value={editingStudent.phone}
                        onChange={(e) =>
                          setEditingStudent({
                            ...editingStudent,
                            phone: e.target.value
                          })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Course
                      </label>

                      <select
                        className="form-select"
                        value={editingStudent.course}
                        onChange={(e) =>
                          setEditingStudent({
                            ...editingStudent,
                            course: e.target.value
                          })
                        }
                        required
                      >
                        <option value="">
                          Select Course
                        </option>

                        <option value="BCA">BCA</option>
                        <option value="MCA">MCA</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="BBA">BBA</option>
                        <option value="MBA">MBA</option>
                        <option value="B.Com">B.Com</option>
                        <option value="M.Com">M.Com</option>
                        <option value="Ph.D">Ph.D</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-semibold">
                        Semester
                      </label>

                      <select
                        className="form-select"
                        value={editingStudent.semester}
                        onChange={(e) =>
                          setEditingStudent({
                            ...editingStudent,
                            semester: e.target.value
                          })
                        }
                        required
                      >
                        <option value="">
                          Select
                        </option>

                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-semibold">
                        Status
                      </label>

                      <select
                        className="form-select"
                        value={editingStudent.status}
                        onChange={(e) =>
                          setEditingStudent({
                            ...editingStudent,
                            status: e.target.value
                          })
                        }
                      >
                        <option value="Active">
                          Active
                        </option>

                        <option value="Inactive">
                          Inactive
                        </option>
                      </select>
                    </div>

                  </div>

                </div>

                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setEditingStudent(null)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    <i className="bi bi-check-lg me-2"></i>
                    Save Changes
                  </button>

                </div>

              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Students;