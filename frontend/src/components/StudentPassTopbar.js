import { useNavigate } from "react-router-dom";
import "../styles/StudentPassManagement.css";

function StudentPassTopbar({ student, busPass, feeSummary }) {
  const navigate = useNavigate();

  const hasPass = !!busPass || !!feeSummary;
  const status = student
    ? hasPass
      ? feeSummary?.status || busPass?.status || "Pending"
      : "Not Applied"
    : null;

  const statusClass = status ? status.toLowerCase().replace(" ", "-") : "";

  return (
    <div className="spm-topbar">
      {/* LEFT SECTION */}
      <div className="topbar-left">
        <button
          className="home-btn"
          onClick={() => navigate("/home")}
          title="Back to Home"
        >
          ← Home
        </button>

        <div>
          <h2>Student Bus Pass Management</h2>
          <span className="topbar-subtitle">Transport Officer Module</span>
        </div>
      </div>

      {/* RIGHT SECTION (ONLY IF STUDENT EXISTS) */}
      {student && (
        <div className="topbar-right">
          <span className="reg-no">
            <strong>Reg No:</strong> {student.reg_no}
          </span>

          <span className={`status-badge ${statusClass}`}>{status}</span>
        </div>
      )}
    </div>
  );
}

export default StudentPassTopbar;
