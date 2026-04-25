import React from "react";

function RASidebar({ activeTab, setActiveTab }) {
  return (
    <div className="sidebar">
      <ul>
        <li
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </li>

        <li
          className={activeTab === "busUsage" ? "active" : ""}
          onClick={() => setActiveTab("busUsage")}
        >
          Bus Usage Report
        </li>

        <li
          className={activeTab === "boarding" ? "active" : ""}
          onClick={() => setActiveTab("boarding")}
        >
          Boarding Point Analysis
        </li>

        <li
          className={activeTab === "status" ? "active" : ""}
          onClick={() => setActiveTab("status")}
        >
          Pass Status Report
        </li>

        <li
          className={activeTab === "payments" ? "active" : ""}
          onClick={() => setActiveTab("payments")}
        >
          Payment Reports
        </li>

        <li
          className={activeTab === "monthly" ? "active" : ""}
          onClick={() => setActiveTab("monthly")}
        >
          Monthly Analytics
        </li>
      </ul>
    </div>
  );
}

export default RASidebar;
