import React from "react";

function Topbar() {
  return (
    <div className="page-header">
      <a href="/home" className="home-link">
        ← Home
      </a>

      <div className="header-text">
        <h2>Reports & Analytics</h2>
        <p>Transport Officer Module</p>
      </div>
    </div>
  );
}

export default Topbar;
