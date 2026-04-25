import {
  FaIdCard,
  FaBus,
  FaUsers,
  FaTools,
  FaChartLine,
  FaChartBar,
} from "react-icons/fa";

import ModuleCard from "../components/TOModuleCard";
import Header from "../components/TOHeader";
import "../styles/TOHome.css";

function TOHome() {
  return (
    <>
      {/* Fixed Top Header */}
      <Header />

      {/* Page Content (offset for fixed header) */}
      <div className="page-content">
        <div className="home-container">
          <div className="dashboard-wrapper">
            <div className="dashboard-header">
              <h2>Campus Transport Management Platform</h2>
              <p>Transport Officer Dashboard</p>
            </div>

            <div className="module-grid">
              <ModuleCard
                title="Student & Bus Pass"
                description="Manage student transport records and bus pass generation"
                path="/student-pass"
                icon={<FaIdCard />}
              />

              <ModuleCard
                title="Bus, Route & Trip Management"
                description="Manage buses, routes, boarding points, trip schedules, insurance, and fitness details"
                path="/transport-management"
                icon={<FaBus />}
              />

              <ModuleCard
                title="Driver & Bus Workers"
                description="Manage drivers, helpers, and bus assignments"
                path="/staff-management"
                icon={<FaUsers />}
              />

              <ModuleCard
                title="Fuel & Maintenance Management"
                description="Track fuel consumption, mileage, servicing history, expenses, and bus condition"
                path="/fuel-maintenance"
                icon={<FaTools />}
              />

              <ModuleCard
                title="Finance Management"
                description="Track transport expenses, bus pass revenue, and financial summaries"
                path="/finance"
                icon={<FaChartLine />}
              />

              <ModuleCard
                title="Reports & Analytics"
                description="View transport statistics and operational insights"
                path="/reports"
                icon={<FaChartBar />}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TOHome;
