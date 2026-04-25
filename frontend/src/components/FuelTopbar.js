import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FuelMaintenance.css";

const FuelMaintenanceTopbar = ({ bus }) => {
  const navigate = useNavigate();
  const [fitnessStatus, setFitnessStatus] = useState(null);

  const status = bus?.operational_status || null;

  useEffect(() => {
    if (!bus) return;

    fetch(
      `http://localhost/transport_api/expenses/get_bus_health.php?bus_id=${bus.bus_id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFitnessStatus(data.data.fitness_status);
        }
      });
  }, [bus]);

  const statusClass = status ? status.toLowerCase().replace(/\s+/g, "-") : "";

  const fitnessClass =
    fitnessStatus === "Valid" ? "fitness-valid" : "fitness-expired";

  return (
    <div className="spm-topbar">
      <div className="topbar-left">
        <button className="home-btn" onClick={() => navigate("/home")}>
          ← Home
        </button>

        <div>
          <h2>Fuel & Maintenance Management</h2>
          <span className="topbar-subtitle">Transport Officer Module</span>
        </div>
      </div>

      {bus && (
        <div className="topbar-right">
          <span className="reg-no">
            <strong>Bus No:</strong> {bus.bus_number}
          </span>

          <span className={`status-badge ${statusClass}`}>{status}</span>

          {fitnessStatus && (
            <span className={`status-badge ${fitnessClass}`}>
              Fitness {fitnessStatus}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FuelMaintenanceTopbar;
