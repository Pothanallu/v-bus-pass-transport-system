import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TOHeader.css";
import logo from "../assets/vignanlogo.png";

function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const admin = JSON.parse(localStorage.getItem("admin"));

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const goToProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  const goToManageAccount = () => {
    setOpen(false);
    navigate("/manage-account");
  };

  if (!admin) return null;

  return (
    <div className="top-header">
      {/* LEFT: LOGO */}
      <div className="header-left">
        <img src={logo} alt="College Logo" className="header-logo" />
      </div>

      {/* RIGHT: PROFILE */}
      <div className="profile-wrapper">
        <div className="profile-button" onClick={() => setOpen(!open)}>
          <div className="profile-avatar">
            {admin.name.charAt(0).toUpperCase()}
          </div>
          <span className="profile-name">{admin.name}</span>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <div className="profile-avatar large">
                {admin.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{admin.name}</strong>
                <div className="role-text">{admin.role}</div>
              </div>
            </div>

            <div className="dropdown-item" onClick={goToProfile}>
              Profile
            </div>

            <div className="dropdown-item" onClick={goToManageAccount}>
              Manage Account
            </div>

            <div className="dropdown-item logout" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
