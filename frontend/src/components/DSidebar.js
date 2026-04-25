import React from "react";
import "../styles/DriverWorkers.css";

const DriverWorkersSidebar = ({ activeTab, setActiveTab }) => {
  const menu = [
    { key: "dashboard", label: "Dashboard" },
    { key: "allDrivers", label: "All Drivers" },
    { key: "addDriver", label: "Add Driver" },
    { key: "allWorkers", label: "All Workers" },
    { key: "addWorker", label: "Add Worker" },
    { key: "assignments", label: "Bus Assignments" },
  ];

  return (
    <div className="dw-sidebar">
      <h3 className="dw-sidebar-title">Driver Management</h3>

      <ul className="dw-menu">
        {menu.map((item) => (
          <li
            key={item.key}
            className={activeTab === item.key ? "active" : ""}
            onClick={() => setActiveTab(item.key)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
