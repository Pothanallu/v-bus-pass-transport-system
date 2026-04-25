import React from "react";

function FSidebar({ activeTab, setActiveTab }) {
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
          className={activeTab === "revenue" ? "active" : ""}
          onClick={() => setActiveTab("revenue")}
        >
          Revenue Reports
        </li>

        <li
          className={activeTab === "expenses" ? "active" : ""}
          onClick={() => setActiveTab("expenses")}
        >
          Expense Reports
        </li>

        <li
          className={activeTab === "profit" ? "active" : ""}
          onClick={() => setActiveTab("profit")}
        >
          Profit / Loss
        </li>

        <li
          className={activeTab === "monthly" ? "active" : ""}
          onClick={() => setActiveTab("monthly")}
        >
          Monthly Report
        </li>
      </ul>
    </div>
  );
}

export default FSidebar;
