import "../styles/FuelMaintenance.css";
import React from "react";

import "../styles/FuelMaintenance.css";

const FuelMaintenanceSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="spm-sidebar">
      <button
        className={activeTab === "busHealth" ? "active" : ""}
        onClick={() => setActiveTab("busHealth")}
      >
        Bus Health Status
      </button>

      <button
        className={activeTab === "fuelLogs" ? "active" : ""}
        onClick={() => setActiveTab("fuelLogs")}
      >
        Fuel Logs
      </button>

      <button
        className={activeTab === "serviceRecords" ? "active" : ""}
        onClick={() => setActiveTab("serviceRecords")}
      >
        Service Records
      </button>

      <button
        className={activeTab === "maintenanceExpenses" ? "active" : ""}
        onClick={() => setActiveTab("maintenanceExpenses")}
      >
        Maintenance Expenses
      </button>
    </div>
  );
};

export default FuelMaintenanceSidebar;
