import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function ManageAccount() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    setMessage("");
    setError("");

    /* =========================
       FRONTEND VALIDATION
    ========================= */
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost/transport_api/auth/change_password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            admin_id: admin.admin_id,
            old_password: oldPassword,
            new_password: newPassword,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setMessage("Password updated successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Failed to update password");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="manage-account-card">
      {/* 🔙 BACK BUTTON */}
      <button className="profile-back-btn" onClick={() => navigate("/home")}>
        ← Back to Home
      </button>

      <h3>Manage Account</h3>

      <input
        type="password"
        placeholder="Current Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Re-enter New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleChangePassword}>Change Password</button>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}
    </div>
  );
}

export default ManageAccount;
