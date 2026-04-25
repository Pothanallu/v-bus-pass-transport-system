import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TOLogin.css";

function TOLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost/transport_api/auth/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("admin", JSON.stringify(data.admin));
        navigate("/home");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Transport Officer Login</h2>
        <p>Campus Transport Management System</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default TOLogin;
