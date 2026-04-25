import React, { useEffect, useState } from "react";
import "../styles/FuelMaintenance.css";

const BusHealthStatus = ({ bus }) => {
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    if (!bus) return;

    fetch(
      `http://localhost/transport_api/expenses/get_bus_health.php?bus_id=${bus.bus_id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHealthData(data.data);
        }
      });
  }, [bus]);

  if (!bus) {
    return (
      <div className="fm-card">
        <h3>Bus Health Status</h3>
        <p>Please search and select a bus to view health status.</p>
      </div>
    );
  }

  if (!healthData) {
    return (
      <div className="fm-card">
        <h3>Bus Health Status — {bus.bus_number}</h3>
        <p>Loading health data...</p>
      </div>
    );
  }

  const {
    operational_status,
    fitness_status,
    last_service_date,
    total_expense,
    overall_health,
  } = healthData;

  return (
    <div className="fm-card">
      <h3>Bus Health Status — {bus.bus_number}</h3>

      <div className="fm-stats-grid">
        <div className="fm-stat-box">
          <h4>Operational Status</h4>
          <p
            className={`status-${operational_status?.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {operational_status}
          </p>
        </div>

        <div className="fm-stat-box">
          <h4>Fitness Status</h4>
          <p>{fitness_status}</p>
        </div>

        <div className="fm-stat-box">
          <h4>Last Service</h4>
          <p>{last_service_date || "No records"}</p>
        </div>

        <div className="fm-stat-box">
          <h4>Total Maintenance Cost</h4>
          <p>₹ {total_expense}</p>
        </div>

        <div className="fm-stat-box overall">
          <h4>Overall Health</h4>
          <p>{overall_health}</p>
        </div>
      </div>
    </div>
  );
};

export default BusHealthStatus;
