function Navbar() {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })

  return (
    <nav
      className="navbar bg-white border-bottom px-4"
      style={{
        minHeight: "72px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
      }}
    >
      {/* LEFT SIDE */}
      <div className="d-flex align-items-center">

        <div
          className="d-flex align-items-center justify-content-center me-3"
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #1e3c72, #2a5298)"
          }}
        >
          <i
            className="bi bi-book-half text-white"
            style={{ fontSize: "22px" }}
          ></i>
        </div>

        <div>

          <h4
            className="mb-1 fw-bold"
            style={{
              color: "#172b4d",
              letterSpacing: "0.2px"
            }}
          >
            Library Management System
          </h4>

          <div
            className="d-flex align-items-center"
            style={{
              color: "#6c757d",
              fontSize: "14px"
            }}
          >
            <span className="fw-semibold">
              SVGU College Library
            </span>

            <span className="mx-2">•</span>

            <span>Admin Dashboard</span>
          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="d-flex align-items-center gap-4">

        {/* DATE */}
        <div
          className="d-flex align-items-center px-3 py-2"
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            color: "#495057"
          }}
        >
          <i className="bi bi-calendar3 me-2"></i>

          <span
            className="fw-medium"
            style={{ fontSize: "14px" }}
          >
            {today}
          </span>
        </div>


        {/* ADMIN */}
        <div className="d-flex align-items-center">

          <div
            className="d-flex align-items-center justify-content-center me-2"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#172b4d",
              color: "white"
            }}
          >
            <i className="bi bi-person-fill"></i>
          </div>

          <div>

            <div
              className="fw-bold"
              style={{
                fontSize: "15px",
                color: "#212529"
              }}
            >
              Library Admin
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#6c757d"
              }}
            >
              Administrator
            </div>

          </div>

        </div>

      </div>

    </nav>
  )
}

export default Navbar