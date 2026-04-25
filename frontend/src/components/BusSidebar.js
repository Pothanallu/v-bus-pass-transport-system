import "../styles/BusManagement.css";

function BusSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="spm-sidebar">
      {/* ALL BUSES – ALWAYS ENABLED */}
      <button
        className={activeTab === "all" ? "active" : ""}
        onClick={() => setActiveTab("all")}
      >
        All Buses
      </button>

      {/* MANAGE BUS */}
      <button
        className={activeTab === "details" ? "active" : ""}
        onClick={() => setActiveTab("details")}
      >
        Manage Bus
      </button>

      {/* MANAGE INSURANCE */}
      <button
        className={activeTab === "insurance" ? "active" : ""}
        onClick={() => setActiveTab("insurance")}
      >
        Manage Insurance
      </button>

      {/* MANAGE FITNESS */}
      <button
        className={activeTab === "fitness" ? "active" : ""}
        onClick={() => setActiveTab("fitness")}
      >
        Manage Fitness
      </button>

      {/* ROUTES */}
      <button
        className={activeTab === "routes" ? "active" : ""}
        onClick={() => setActiveTab("routes")}
      >
        Bus Routes
      </button>

      {/* TRIPS */}
      <button
        className={activeTab === "trips" ? "active" : ""}
        onClick={() => setActiveTab("trips")}
      >
        Trips
      </button>
    </div>
  );
}

export default BusSidebar;
