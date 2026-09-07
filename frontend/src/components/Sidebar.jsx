import svguLogo from "../assets/svgu-logo.png"

function Sidebar({ setPage, setLoggedIn, page }) {

  const menuItems = [
    { name: "Dashboard", pageName: "dashboard", icon: "bi-speedometer2" },
    { name: "Books", pageName: "books", icon: "bi-book" },
    { name: "Students", pageName: "students", icon: "bi-people" },
    { name: "Issue Book", pageName: "issue", icon: "bi-box-arrow-up-right" },
    { name: "Return Book", pageName: "return", icon: "bi-arrow-return-left" }
  ]

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-circle">
          <img src={svguLogo} alt="SVGU Logo" />
        </div>

        <h5>
          Sardar Vallabhbhai
          <br />
          Global University
        </h5>

        <p>College Library</p>
      </div>

      <div className="menu-title">
        MAIN MENU
      </div>

      <div className="sidebar-menu">

        {menuItems.map((item) => (

          <button
            key={item.pageName}
            onClick={() => setPage(item.pageName)}
            className={`menu-item ${
              page === item.pageName ? "active" : ""
            }`}
          >
            <i className={`bi ${item.icon}`}></i>

            <span>{item.name}</span>
          </button>

        ))}

      </div>

      <div className="sidebar-bottom">

        <i className="bi bi-bank2 university-icon"></i>

        <p className="university-name">
          Sardar Vallabhbhai
          <br />
          Global University
        </p>

        <p className="university-text">
          Excellence • Integrity • Innovation
        </p>

      </div>

      <div className="logout-section">

        <button
          onClick={setLoggedIn}
          className="logout-btn"
        >
          <i className="bi bi-box-arrow-right"></i>
          Logout
        </button>

      </div>

    </aside>
  )
}

export default Sidebar