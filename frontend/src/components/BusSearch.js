import { useEffect, useState } from "react";

function BusSearch({ onBusFound }) {
  const [allBuses, setAllBuses] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");

  /* Load all buses */
  useEffect(() => {
    fetch("http://localhost/transport_api/buses/get_buses.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAllBuses(data.data);
          setFiltered(data.data); // ✅ initial list
        }
      });
  }, []);

  /* Filter buses */
  useEffect(() => {
    if (!showDropdown) return;

    if (!search.trim()) {
      setFiltered(allBuses); // ✅ show all on focus
    } else {
      setFiltered(
        allBuses.filter((b) =>
          b.bus_number.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search, allBuses, showDropdown]);

  /* Search / Select bus */
  const searchBus = async (busNumber) => {
    if (!busNumber.trim()) {
      setError("Enter bus number");
      return;
    }

    setSearch(busNumber); // ✅ FULL value set
    setShowDropdown(false); // ✅ close dropdown
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

      if (data.success) {
        onBusFound(data.bus, data.inspection, data.insuranceData ?? null);
      } else {
        setError(data.message || "Bus not found");
        onBusFound(null, null, null);
      }
    } catch {
      setError("Server error");
      onBusFound(null, null, null);
    }
  };

  return (
    <div className="bus-search-wrapper">
      <div className="bus-search-row">
        <input
          type="text"
          placeholder="Search or select bus number"
          value={search}
          onFocus={() => setShowDropdown(true)} // ✅ show on click
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={() => searchBus(search)}>Search</button>
      </div>

      {showDropdown && filtered.length > 0 && (
        <ul className="bus-search-dropdown">
          {filtered.map((bus) => (
            <li
              key={bus.bus_id}
              onClick={() => searchBus(bus.bus_number)} // ✅ full value
            >
              {bus.bus_number}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default BusSearch;
