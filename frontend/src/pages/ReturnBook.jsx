import { useEffect, useState } from "react";
import { getIssues, returnBook } from "../services/issueService";

function ReturnBook() {

  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (dateValue) => {

    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // =========================
  // GET LATE DAYS
  // =========================

  const getLateDays = (dueDate) => {

    if (!dueDate) return 0;

    const due = new Date(dueDate);
    const today = new Date();

    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference =
      today.getTime() - due.getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  // =========================
  // ESTIMATED FINE
  // =========================

  const getEstimatedFine = (dueDate) => {

    const lateDays = getLateDays(dueDate);

    return lateDays * 5;
  };

  // =========================
  // LOAD ISSUES
  // =========================

  const loadIssues = async () => {

    try {

      const data = await getIssues();

      setIssues(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load issues:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to load issued books"
      );
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  // =========================
  // RETURN BOOK
  // =========================

  const handleReturn = async (issue) => {

    const lateDays =
      getLateDays(issue.dueDate);

    const estimatedFine =
      getEstimatedFine(issue.dueDate);

    let confirmMessage =
      `Are you sure you want to return this book?\n\n` +
      `Book: ${issue.book?.title || "N/A"}\n` +
      `Student: ${issue.student?.name || "N/A"}\n` +
      `Due Date: ${formatDate(issue.dueDate)}\n`;

    if (lateDays > 0) {

      confirmMessage +=
        `\n⚠️ OVERDUE\n` +
        `Late Days: ${lateDays}\n` +
        `Estimated Fine: ₹${estimatedFine}\n` +
        `Fine Rate: ₹5/day\n`;

    } else {

      confirmMessage +=
        `\nNo late fine.\n`;

    }

    const confirmReturn =
      window.confirm(confirmMessage);

    if (!confirmReturn) {
      return;
    }

    try {

      const data =
        await returnBook(issue._id);

      const actualLateDays =
        Number(data?.lateDays || 0);

      const actualFine =
        Number(data?.fine || 0);

      alert(
        `Book returned successfully!\n\n` +
        `Return Date: ${formatDate(new Date())}\n` +
        `Due Date: ${formatDate(issue.dueDate)}\n` +
        `Late Days: ${actualLateDays}\n` +
        `Fine: ₹${actualFine}`
      );

      await loadIssues();

    } catch (error) {

      console.error(
        "RETURN BOOK ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to return book"
      );
    }
  };

  // =========================
  // FILTER
  // =========================

  const filteredIssues =
    issues.filter((issue) => {

      const searchText = `
        ${issue.book?.title || ""}
        ${issue.book?.bookId || ""}
        ${issue.book?.isbn || ""}
        ${issue.student?.name || ""}
        ${issue.student?.enrollmentNo || ""}
      `.toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        );

      const matchesStatus =
        statusFilter === "All" ||
        issue.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // =========================
  // COUNTS
  // =========================

  const issuedCount =
    issues.filter(
      (issue) => issue.status === "Issued"
    ).length;

  const returnedCount =
    issues.filter(
      (issue) => issue.status === "Returned"
    ).length;

  const overdueCount =
    issues.filter(
      (issue) =>
        issue.status === "Issued" &&
        getLateDays(issue.dueDate) > 0
    ).length;

  return (

    <div className="container-fluid p-4">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <div className="d-flex align-items-center gap-2">

            <div
              className="rounded-3 d-flex align-items-center justify-content-center bg-success bg-opacity-10"
              style={{
                width: "45px",
                height: "45px"
              }}
            >
              <i className="bi bi-arrow-return-left text-success fs-4"></i>
            </div>

            <div>

              <h3 className="fw-bold mb-1">
                Return Book
              </h3>

              <p className="text-muted mb-0">
                Manage issued, overdue and returned books
              </p>

            </div>

          </div>

        </div>

        <span className="badge bg-primary fs-6 px-3 py-2">
          Records: {filteredIssues.length}
        </span>

      </div>

      {/* ========================= */}
      {/* SUMMARY */}
      {/* ========================= */}

      <div className="row g-3 mb-4">

        <div className="col-md-3">

          <div className="card border-0 shadow-sm">

            <div className="card-body">

              <div className="text-muted small">
                Total Records
              </div>

              <div className="fs-3 fw-bold">
                {issues.length}
              </div>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card border-0 shadow-sm">

            <div className="card-body">

              <div className="text-muted small">
                Currently Issued
              </div>

              <div className="fs-3 fw-bold text-warning">
                {issuedCount}
              </div>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card border-0 shadow-sm">

            <div className="card-body">

              <div className="text-muted small">
                Overdue
              </div>

              <div className="fs-3 fw-bold text-danger">
                {overdueCount}
              </div>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card border-0 shadow-sm">

            <div className="card-body">

              <div className="text-muted small">
                Returned
              </div>

              <div className="fs-3 fw-bold text-success">
                {returnedCount}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* SEARCH */}
      {/* ========================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body p-4">

          <div className="row g-3">

            <div className="col-md-8">

              <label className="form-label fw-semibold">
                Search
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by book, Book ID, student or enrollment number..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="col-md-4">

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

                <option value="All">
                  All
                </option>

                <option value="Issued">
                  Issued
                </option>

                <option value="Returned">
                  Returned
                </option>

              </select>

            </div>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* TABLE */}
      {/* ========================= */}

      <div className="card shadow-sm border-0">

        <div className="card-body p-4">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-dark">

                <tr>

                  <th>#</th>
                  <th>Book</th>
                  <th>Student</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Late Days</th>
                  <th>Fine</th>
                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredIssues.length === 0 ? (

                  <tr>

                    <td
                      colSpan="10"
                      className="text-center text-muted py-5"
                    >

                      <i className="bi bi-inbox fs-3 d-block mb-2"></i>

                      No records found

                    </td>

                  </tr>

                ) : (

                  filteredIssues.map(
                    (issue, index) => {

                      const lateDays =
                        issue.status === "Issued"
                          ? getLateDays(issue.dueDate)
                          : 0;

                      const isOverdue =
                        issue.status === "Issued" &&
                        lateDays > 0;

                      return (

                        <tr
                          key={issue._id}
                          className={
                            isOverdue
                              ? "table-danger"
                              : ""
                          }
                        >

                          <td>
                            {index + 1}
                          </td>

                          {/* BOOK */}

                          <td>

                            <div className="fw-semibold">
                              {issue.book?.title || "N/A"}
                            </div>

                            <small className="text-muted">
                              ID: {issue.book?.bookId || "—"}
                            </small>

                            <br />

                            <small className="text-muted">
                              {issue.book?.author || ""}
                            </small>

                          </td>

                          {/* STUDENT */}

                          <td>

                            <div className="fw-semibold">
                              {issue.student?.name || "N/A"}
                            </div>

                            <small className="text-muted">
                              {issue.student?.enrollmentNo || "N/A"}
                            </small>

                          </td>

                          {/* ISSUE DATE */}

                          <td>
                            {formatDate(issue.issueDate)}
                          </td>

                          {/* DUE DATE */}

                          <td>

                            <strong
                              className={
                                isOverdue
                                  ? "text-danger"
                                  : ""
                              }
                            >
                              {formatDate(issue.dueDate)}
                            </strong>

                          </td>

                          {/* RETURN DATE */}

                          <td>

                            {issue.status === "Returned"
                              ? formatDate(issue.returnDate)
                              : "—"}

                          </td>

                          {/* STATUS */}

                          <td>

                            {isOverdue ? (

                              <span className="badge bg-danger">
                                <i className="bi bi-exclamation-triangle me-1"></i>
                                Overdue
                              </span>

                            ) : issue.status === "Issued" ? (

                              <span className="badge bg-warning text-dark">
                                <i className="bi bi-book me-1"></i>
                                Issued
                              </span>

                            ) : (

                              <span className="badge bg-success">
                                <i className="bi bi-check-circle me-1"></i>
                                Returned
                              </span>

                            )}

                          </td>

                          {/* LATE DAYS */}

                          <td>

                            {issue.status === "Returned" ? (

                              <span>
                                {issue.lateDays || 0} days
                              </span>

                            ) : lateDays > 0 ? (

                              <strong className="text-danger">
                                {lateDays} days
                              </strong>

                            ) : (

                              <span className="text-success">
                                0 days
                              </span>

                            )}

                          </td>

                          {/* FINE */}

                          <td>

                            <strong
                              className={
                                Number(issue.fine || 0) > 0
                                  ? "text-danger"
                                  : "text-success"
                              }
                            >
                              ₹{issue.fine || 0}
                            </strong>

                          </td>

                          {/* ACTION */}

                          <td>

                            {issue.status === "Issued" ? (

                              <button
                                className={
                                  isOverdue
                                    ? "btn btn-sm btn-danger"
                                    : "btn btn-sm btn-success"
                                }
                                onClick={() =>
                                  handleReturn(issue)
                                }
                              >

                                <i className="bi bi-arrow-return-left me-1"></i>

                                Return

                              </button>

                            ) : (

                              <span className="text-muted">

                                <i className="bi bi-check-circle-fill text-success me-1"></i>

                                Returned

                              </span>

                            )}

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

    </div>
  );
}

export default ReturnBook;