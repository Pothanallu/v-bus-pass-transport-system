import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const adminSession = JSON.parse(localStorage.getItem("admin"));
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (!adminSession) return;

    fetch("http://localhost/transport_api/auth/get_admin.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id: adminSession.admin_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAdmin(data.data);
      });
  }, [adminSession]);

  if (!admin) return <p>Loading profile...</p>;

  return (
    <div className="profile-card">
      {/* 🔙 BACK BUTTON */}
      <button className="profile-back-btn" onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      <div className="profile-avatar-large">
        {admin.name.charAt(0).toUpperCase()}
      </div>

      <h3>My Profile</h3>

      <div className="profile-row">
        <span>Name</span>
        <strong>{admin.name}</strong>
      </div>

      <div className="profile-row">
        <span>Role</span>
        <strong>{admin.role}</strong>
      </div>

      <div className="profile-row">
        <span>Email</span>
        <strong>{admin.email}</strong>
      </div>

      <div className="profile-row">
        <span>Phone</span>
        <strong>{admin.phone}</strong>
      </div>

      <div className="profile-row">
        <span>Username</span>
        <strong>{admin.username}</strong>
      </div>

      <div className="profile-note">
        Profile details are managed by the system administrator.
      </div>
    </div>
  );
}

export default Profile;
