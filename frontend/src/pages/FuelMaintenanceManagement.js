import React, { useState } from "react";
import FuelMaintenanceSidebar from "../components/FuelSidebar";
import FuelMaintenanceTopbar from "../components/FuelTopbar";
import FuelLogs from "../components/FuelLogs";
import ServiceRecords from "../components/ServiceRecords";
import MaintenanceExpenses from "../components/MaintenanceExpenses";
import BusHealthStatus from "../components/BusHealthStatus";
import BusSearch from "../components/FuelBusSearch";

import "../styles/FuelMaintenance.css";

const FuelMaintenanceDashboard = () => {
  const [activeTab, setActiveTab] = useState("welcome");
  const [bus, setBus] = useState(null);

  const handleBusFound = (busData) => {
    if (!busData) {
      setBus(null);
      return;
    }
    setBus(busData);

    setActiveTab("busHealth");
  };

  return (
    <div className="fm-root">
      <FuelMaintenanceTopbar bus={bus} />

      <div className="fm-body">
        <FuelMaintenanceSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="fm-content">
          <BusSearch onBusFound={handleBusFound} />

          {/* =========================
              WELCOME
          ========================= */}
          {activeTab === "welcome" && (
            <div className="welcome-card">
              <h3>Welcome to Fuel & Maintenance Management</h3>
              <p>
                Manage fuel logs, servicing history, expenses and monitor bus
                health.
              </p>

              <ul>
                <li>⛽ Track fuel consumption per bus</li>
                <li>📊 Monitor mileage performance</li>
                <li>🔧 Maintain servicing history</li>
                <li>💰 Control maintenance costs</li>
                <li>⚠ Identify buses needing service</li>
              </ul>
            </div>
          )}

          {/* =========================
              FUEL LOGS
          ========================= */}
          {activeTab === "fuelLogs" &&
            (bus ? (
              <FuelLogs bus={bus} />
            ) : (
              <div className="card warning-card">
                Please search for a bus to manage Fuel logs.
              </div>
            ))}

          {/* =========================
              SERVICE RECORDS
          ========================= */}
          {activeTab === "serviceRecords" &&
            (bus ? (
              <ServiceRecords bus={bus} />
            ) : (
              <div className="card warning-card">
                Please search for a bus to manage Service Records.
              </div>
            ))}

          {/* =========================
              MAINTENANCE EXPENSES
          ========================= */}
          {activeTab === "maintenanceExpenses" &&
            (bus ? (
              <MaintenanceExpenses bus={bus} />
            ) : (
              <div className="card warning-card">
                Please search for a bus to manage Maintenance Expenses.
              </div>
            ))}

          {/* =========================
              BUS HEALTH
          ========================= */}
          {activeTab === "busHealth" &&
            (bus ? (
              <BusHealthStatus bus={bus} />
            ) : (
              <div className="card warning-card">
                Please search for a bus to View Bus Health.
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FuelMaintenanceDashboard;
