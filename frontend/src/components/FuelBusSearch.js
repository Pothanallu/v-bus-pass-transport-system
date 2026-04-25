import { useEffect, useState } from "react";
import "../styles/FuelMaintenance.css";

function FuelBusSearch({ onBusFound }) {
  const [allBuses, setAllBuses] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     LOAD ONLY ACTIVE BUSES
  ========================= */
  useEffect(() => {
    fetch("http://localhost/transport_api/buses/get_buses.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // 🔥 Only Active buses allowed
          const activeBuses = data.data.filter(
            (b) => b.operational_status === "Active",
          );

          setAllBuses(activeBuses);
          setFiltered(activeBuses);
        }
      })
      .catch(() => setError("Failed to load buses"));
  }, []);

  /* =========================
     FILTER BUSES
  ========================= */
  useEffect(() => {
    if (!showDropdown) return;

    if (!search.trim()) {
      setFiltered(allBuses);
    } else {
      setFiltered(
        allBuses.filter((b) =>
          b.bus_number.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search, allBuses, showDropdown]);

  /* =========================
     SEARCH BUS FROM DB
  ========================= */
  const searchBus = async (busNumber) => {
    if (!busNumber.trim()) {
      setError("Enter bus number");
      onBusFound(null);
      return;
    }

    setSearch(busNumber);
    setShowDropdown(false);
    setError("");

    try {
      const res = await fetch(
        "http://localhost/transport_api/buses/search_bus.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bus_number: busNumber }),
        },
      );

      const data = await res.json();

      if (data.success && data.bus.operational_status === "Active") {
        onBusFound(data.bus);
      } else {
        setError("Only Active buses allowed for fuel & expenses");
        onBusFound(null);
      }
    } catch {
      setError("Server error");
      onBusFound(null);
    }
  };

  return (
    <div className="fuel-bus-search">
      <div className="fuel-search-row">
        <input
          type="text"
          placeholder="Search Active Bus"
          value={search}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={() => searchBus(search)}>Search</button>
      </div>

      {showDropdown && filtered.length > 0 && (
        <ul className="fuel-search-dropdown">
          {filtered.map((bus) => (
            <li key={bus.bus_id} onClick={() => searchBus(bus.bus_number)}>
              {bus.bus_number}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="fuel-error-text">{error}</p>}
    </div>
  );
}

export default FuelBusSearch;
