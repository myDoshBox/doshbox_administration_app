import React from "react";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white p-3">
      <div className="container-fluid">
           {/* Logo replaces the text */}
           <a className="navbar-brand fw-bold text-black" href="/">
          <img
            src="/logo.png"
            alt="Logo"
            height="40"
            style={{ objectFit: "contain" }}
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link  text-dark" href="/add-mediators">AddMediators</a>
            </li>
            <li className="nav-item">
              <a className="nav-link  text-dark" href="/get-all-mediators">GetAllMediators</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
