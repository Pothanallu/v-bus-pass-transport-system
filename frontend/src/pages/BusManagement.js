import { useState, useEffect } from "react";

/* Layout Components */
import BusTopbar from "../components/BusTopbar";
import BusSidebar from "../components/BusSidebar";

/* Common Components */
import BusSearch from "../components/BusSearch";

/* View Components */
import BusDetails from "../components/BusDetails";
import BusInspectionDetails from "../components/BusInspectionDetails";
import BusLocationDetails from "../components/BusLocationDetails";
import BusInsuranceDetails from "../components/BusInsuranceDetails";
import BusRoutesSummary from "../components/BusRoutesSummary";
import BusTripsSummary from "../components/BusTripsSummary";

import AllBuses from "../components/AllBuses";
import ManageBusForm from "../components/ManageBusForm";
import ManageInsuranceForm from "../components/ManageInsuranceForm";
import ManageFitnessForm from "../components/ManageFitnessForm";
import BusRoutes from "../components/BusRoutes";
import Trips from "../components/Trips";

/* Styles */
import "../styles/BusManagement.css";

function BusManagement() {
  /* =========================
     STATE
  ========================= */
  const [activeTab, setActiveTab] = useState("welcome");
  const [bus, setBus] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [inspection, setInspection] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [trips, setTrips] = useState([]);

  /* ALL BUSES STATE */
  const [allBuses, setAllBuses] = useState([]);
  const [busCounts, setBusCounts] = useState({
    total: 0,
    active: 0,
    maintenance: 0,
    inactive: 0,
  });

  /* =========================
     GLOBAL BUS SEARCH
     (NO MODE SWITCHING)
  ========================= */
  const handleBusFound = (busData, inspectionData, insuranceData) => {
    // ❌ SEARCH FAILED
    if (!busData) {
      setBus(null);
      setInsurance(null);
      setInspection(null);
      return;
    }

    // ✅ SEARCH SUCCESS
    setBus(busData);
    setInsurance(insuranceData || null);
    setInspection(inspectionData || null);

    loadBusRoutes(busData.bus_id);
    loadBusTrips(busData.bus_id);

    // Exit only from All Buses view
    if (activeTab === "all") {
      setActiveTab("welcome");
    }
  };

  /* =========================
     RESET SEARCH
  ========================= */
  const handleNewSearch = () => {
    setBus(null);
    setInsurance(null);
    setInspection(null);
    setActiveTab("welcome");
  };

  /* =========================
     LOAD ALL BUSES
  ========================= */
  const loadAllBuses = async () => {
    try {
      const res = await fetch(
        "http://localhost/transport_api/buses/get_buses.php",
      );
      const data = await res.json();

      if (data.success) {
        setAllBuses(data.data);
        setBusCounts(data.counts);
      }
    } catch (err) {
      console.error("Failed to load all buses", err);
    }
  };

  /* LOAD DATA WHEN ALL TAB OPENS */
  useEffect(() => {
    if (activeTab === "all") {
      loadAllBuses();
    }
  }, [activeTab]);

  const refreshSearchedBus = async (busNumber) => {
    try {
      const res = await fetch(
        "http://localhost/transport_api/bus/search_bus.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bus_number: busNumber }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setBus(data.bus);
        setInsurance(data.insuranceData || null);
        setInspection(data.inspection || null);
      }
    } catch (err) {
      console.error("Failed to refresh bus", err);
    }
  };

  const loadBusRoutes = async (busId) => {
    try {
      const res = await fetch(
        "http://localhost/transport_api/buses/getRoutesByBus.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bus_id: busId }),
        },
      );

      const data = await res.json();
      if (data.success) setRoutes(data.data);
    } catch (err) {
      console.error("Failed to load routes", err);
    }
  };

  const loadBusTrips = async (busId) => {
    try {
      const res = await fetch(
        "http://localhost/transport_api/buses/getTripsByBus.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bus_id: busId }),
        },
      );

      const data = await res.json();
      if (data.success) setTrips(data.data);
    } catch (err) {
      console.error("Failed to load trips", err);
    }
  };

  return (
    <div className="bm-root">
      {/* 🔒 TOPBAR */}
      <BusTopbar bus={bus} inspection={inspection} />

      <div className="bm-body">
        {/* SIDEBAR */}
        <BusSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasBus={!!bus}
        />

        {/* MAIN CONTENT */}
        <div className="bm-content">
          {/* GLOBAL SEARCH */}
          <BusSearch
            onBusFound={handleBusFound}
            onNewSearch={handleNewSearch}
          />

          {/* =========================
              WELCOME SCREEN
          ========================= */}
          {activeTab === "welcome" && !bus && (
            <div className="card">
              <h3>Welcome to Bus Management</h3>
              <p>
                Manage bus assets, operational status, insurance, and inspection
                details.
              </p>
              <ul>
                <li>🚌 Search bus by bus number</li>
                <li>📋 View bus master details</li>
                <li>🧾 Track fitness & condition</li>
                <li>⚠ Monitor operational status</li>
              </ul>
            </div>
          )}

          {/* =========================
              BUS OVERVIEW (AFTER SEARCH)
          ========================= */}
          {bus && activeTab === "welcome" && (
            <div className="card">
              <h3>Bus Overview</h3>

              <BusDetails bus={bus} />

              {insurance && (
                <>
                  <hr />
                  <BusInsuranceDetails insurance={insurance} />
                </>
              )}

              {inspection && (
                <>
                  <hr />
                  <BusInspectionDetails inspection={inspection} />
                </>
              )}

              <BusLocationDetails bus={bus} />

              {routes?.length > 0 && (
                <>
                  <hr />
                  <BusRoutesSummary routes={routes} />
                </>
              )}

              {trips?.length > 0 && (
                <>
                  <hr />
                  <BusTripsSummary trips={trips} />
                </>
              )}
            </div>
          )}

          {/* =========================
              ALL BUSES DASHBOARD
          ========================= */}
          {activeTab === "all" && (
            <AllBuses buses={allBuses} counts={busCounts} />
          )}

          {/* =========================
              MANAGE BUS
          ========================= */}
          {activeTab === "details" && (
            <ManageBusForm
              bus={bus}
              onSuccess={(savedBusNumber) => {
                alert("Bus saved successfully");

                loadAllBuses(); // refresh fleet

                if (savedBusNumber) {
                  refreshSearchedBus(savedBusNumber); // refresh searched bus
                }

                setActiveTab("welcome"); // return to overview
              }}
            />
          )}

          {/* =========================
              MANAGE INSURANCE
          ========================= */}
          {activeTab === "insurance" &&
            (bus ? (
              <ManageInsuranceForm
                bus={bus}
                insurance={insurance}
                onSuccess={() => {
                  alert("Insurance saved successfully");

                  loadAllBuses(); // 🔄 refresh fleet
                  refreshSearchedBus(bus.bus_number); // 🔄 refresh searched bus

                  setActiveTab("welcome"); // ⬅️ back to overview
                }}
              />
            ) : (
              <div className="card warning-card">
                Please search for a bus to manage insurance.
              </div>
            ))}

          {activeTab === "fitness" &&
            (bus ? (
              <ManageFitnessForm
                bus={bus}
                inspection={inspection}
                onSuccess={() => {
                  alert("Fitness saved successfully");

                  loadAllBuses(); // 🔄 refresh fleet
                  refreshSearchedBus(bus.bus_number); // 🔄 refresh searched bus

                  setActiveTab("welcome"); // ⬅️ back to overview
                }}
              />
            ) : (
              <div className="card warning-card">
                Please search for a bus to manage fitness.
              </div>
            ))}

          {activeTab === "routes" && <BusRoutes />}
          {activeTab === "trips" && <Trips />}
        </div>
      </div>
    </div>
  );
}

export default BusManagement;
