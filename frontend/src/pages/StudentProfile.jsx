import { useEffect, useState } from "react"

function StudentProfile() {

  const [student, setStudent] = useState(null)

  useEffect(() => {
    const savedStudent = localStorage.getItem("student")

    if (savedStudent) {
      setStudent(JSON.parse(savedStudent))
    }
  }, [])

  if (!student) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Student information not found.
        </div>
      </div>
    )
  }

  return (
    <div
      className="container-fluid py-4 px-4"
      style={{
        background: "#f5f7fb",
        minHeight: "calc(100vh - 70px)"
      }}
    >

      {/* PAGE HEADER */}
      <div className="mb-4">
        <h2
          className="fw-bold mb-1"
          style={{ color: "#1f2937" }}
        >
          My Profile
        </h2>

        <p className="text-muted mb-0">
          View your library profile information
        </p>
      </div>


      <div className="row justify-content-center">

        <div className="col-lg-9">

          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "16px",
              overflow: "hidden"
            }}
          >

            {/* PROFILE HEADER */}
            <div
              className="p-4"
              style={{
                background:
                  "linear-gradient(135deg, #0b1f3a, #1f4b87)"
              }}
            >

              <div className="d-flex align-items-center">

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    fontSize: "28px"
                  }}
                >
                  <i className="bi bi-person-fill"></i>
                </div>

                <div>

                  <h3 className="text-white fw-bold mb-1">
                    {student.name || "-"}
                  </h3>

                  <p
                    className="mb-0"
                    style={{ color: "#dbeafe" }}
                  >
                    Student • SVGU Library
                  </p>

                </div>

              </div>

            </div>


            {/* STUDENT INFORMATION */}
            <div className="card-body p-4 p-md-5">

              <h5
                className="fw-bold mb-4"
                style={{ color: "#1f2937" }}
              >
                <i className="bi bi-person-vcard me-2 text-primary"></i>
                Student Information
              </h5>


              <div className="row g-4">


                {/* STUDENT NAME */}
                <div className="col-md-6">

                  <div className="p-3 border rounded-3 h-100">

                    <small className="text-muted">
                      Student Name
                    </small>

                    <h6 className="fw-semibold mt-2 mb-0">
                      {student.name || "-"}
                    </h6>

                  </div>

                </div>


                {/* ENROLLMENT NUMBER */}
                <div className="col-md-6">

                  <div className="p-3 border rounded-3 h-100">

                    <small className="text-muted">
                      Enrollment Number
                    </small>

                    <h6 className="fw-semibold mt-2 mb-0">
                      {student.enrollmentNo || "-"}
                    </h6>

                  </div>

                </div>


                {/* STUDENT EMAIL */}
                <div className="col-md-6">

                  <div className="p-3 border rounded-3 h-100">

                    <small className="text-muted">
                      Student Email
                    </small>

                    <h6
                      className="fw-semibold mt-2 mb-0"
                      style={{ wordBreak: "break-word" }}
                    >
                      {student.email || "-"}
                    </h6>

                  </div>

                </div>


                {/* COURSE */}
                <div className="col-md-6">

                  <div className="p-3 border rounded-3 h-100">

                    <small className="text-muted">
                      Course
                    </small>

                    <h6 className="fw-semibold mt-2 mb-0">
                      {student.course || "-"}
                    </h6>

                  </div>

                </div>


                {/* SEMESTER */}
                <div className="col-md-6">

                  <div className="p-3 border rounded-3 h-100">

                    <small className="text-muted">
                      Semester
                    </small>

                    <h6 className="fw-semibold mt-2 mb-0">
                      {student.semester || "-"}
                    </h6>

                  </div>

                </div>


                {/* PHONE NUMBER */}
                <div className="col-md-6">

                  <div className="p-3 border rounded-3 h-100">

                    <small className="text-muted">
                      Phone Number
                    </small>

                    <h6 className="fw-semibold mt-2 mb-0">
                      {student.phone || "-"}
                    </h6>

                  </div>

                </div>


                {/* LIBRARY STATUS */}
                <div className="col-md-6">

                  <div className="p-3 border rounded-3 h-100">

                    <small className="text-muted">
                      Library Status
                    </small>

                    <div className="mt-2">

                      <span
                        className="badge px-3 py-2"
                        style={{
                          background: "#dcfce7",
                          color: "#166534"
                        }}
                      >

                        <i className="bi bi-check-circle me-1"></i>

                        Active Member

                      </span>

                    </div>

                  </div>

                </div>

              </div>


              {/* INFO MESSAGE */}
              <div
                className="mt-4 p-3 rounded-3"
                style={{
                  background: "#eff6ff",
                  color: "#1e40af"
                }}
              >

                <i className="bi bi-info-circle me-2"></i>

                Your profile information is linked with your
                library account.

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default StudentProfile