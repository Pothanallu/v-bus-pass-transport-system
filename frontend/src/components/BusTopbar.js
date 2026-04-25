import { useNavigate } from "react-router-dom";
import "../styles/BusManagement.css";

function BusTopbar({ bus, inspection }) {
  const navigate = useNavigate();

  const status = bus?.operational_status || null;

  const fitnessStatus =
    inspection?.fitness_expiry_date &&
    new Date(inspection.fitness_expiry_date) >= new Date()
      ? "Fitness Valid"
      : "Fitness Expired";

  const statusClass = status ? status.toLowerCase().replace(/\s+/g, "-") : "";

  const fitnessClass =
    fitnessStatus === "Fitness Valid" ? "fitness-valid" : "fitness-expired";

  return (
    <div className="spm-topbar">
      {/* LEFT */}
      <div className="topbar-left">
        <button className="home-btn" onClick={() => navigate("/home")}>
          ← Home
        </button>

        <div>
          <h2>Bus Management</h2>
          <span className="topbar-subtitle">Transport Officer Module</span>
        </div>
      </div>

      {/* RIGHT */}
      {bus && (
        <div className="topbar-right">
          <span className="reg-no">
            <strong>Bus No:</strong> {bus.bus_number}
          </span>

          <span className={`status-badge ${statusClass}`}>{status}</span>

          <span className={`status-badge ${fitnessClass}`}>
            {fitnessStatus}
          </span>
        </div>
      )}
    </div>
  );
}

export default BusTopbar;
