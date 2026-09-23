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

      {/* ========================= */}
      {/* LEFT SIDE */}
      {/* ========================= */}

      <div className="d-flex align-items-center">

        {/* SVGU LOGO */}

        <div
          className="d-flex align-items-center justify-content-center me-3"
          style={{
            width: "48px",
            height: "48px",
            overflow: "hidden"
          }}
        >

          <img
            src="/svgu-logo.png"
            alt="SVGU Logo"
            style={{
              width: "46px",
              height: "46px",
              objectFit: "contain"
            }}
          />

        </div>


        {/* TITLE */}

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

            <span
              className="mx-2"
              style={{
                color: "#adb5bd"
              }}
            >
              •
            </span>

            <span>
              Admin Dashboard
            </span>

          </div>

        </div>

      </div>


      {/* ========================= */}
      {/* RIGHT SIDE */}
      {/* ========================= */}

      <div className="d-flex align-items-center gap-4">

        {/* DATE */}

        <div
          className="d-flex align-items-center"
          style={{
            color: "#495057",
            fontSize: "14px"
          }}
        >

          <i
            className="bi bi-calendar3 me-2"
            style={{
              fontSize: "17px",
              color: "#172b4d"
            }}
          ></i>

          <span className="fw-medium">
            {today}
          </span>

        </div>


        {/* VERTICAL DIVIDER */}

        <div
          style={{
            width: "1px",
            height: "32px",
            backgroundColor: "#dee2e6"
          }}
        ></div>


        {/* ADMIN */}

        <div className="d-flex align-items-center">

          {/* USER ICON - NO ROUND BACKGROUND */}

          <i
            className="bi bi-person-badge me-2"
            style={{
              fontSize: "25px",
              color: "#172b4d"
            }}
          ></i>


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

