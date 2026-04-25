import { useEffect, useState } from "react";
import "../styles/StudentPassManagement.css";

function BusPassForm({ student, onCreated }) {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* Load cities */
  useEffect(() => {
    fetch("http://localhost/transport_api/buses/get_cities.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCities(data.data);
      });
  }, []);

  /* Load buses by city */
  useEffect(() => {
    if (!selectedCity) {
      setBuses([]);
      return;
    }

    fetch(
      `http://localhost/transport_api/buses/get_buses_by_city.php?city=${selectedCity}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBuses(data.data);
      });
  }, [selectedCity]);

  /* Create bus pass */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBus) {
      setError("Please select a bus");
      return;
    }

    setError("");
    setMessage("");

    const response = await fetch(
      "http://localhost/transport_api/student/create_pass.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reg_no: student.reg_no,
          city: selectedCity, // ✅ city
          bus_no: selectedBus.bus_number, // ✅ bus number
          route: selectedBus.route, // ✅ boarding point
        }),
      },
    );

    const data = await response.json();

    if (data.success) {
      setMessage("Bus pass created successfully");
      if (onCreated) {
        onCreated({
          city: selectedCity,
          bus_no: selectedBus.bus_number,
          route: selectedBus.route,
          status: "Pending",
        });
      }
    } else {
      setError(data.message || "Failed to create bus pass");
    }
  };

  return (
    <div className="buspass-form-card">
      <h3>Create New Bus Pass</h3>

      <form className="buspass-form" onSubmit={handleSubmit}>
        {/* City dropdown */}
        <div className="buspass-field">
          <label className="buspass-label">Select City</label>
          <select
            className="buspass-select"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedBus(null);
            }}
            required
          >
            <option value="">-- Select City --</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Bus radio buttons */}
        {buses.length > 0 && (
          <div className="buspass-field">
            <label className="buspass-label">Select Bus</label>

            <div className="buspass-radio-list">
              {buses.map((bus, idx) => (
                <label key={idx} className="buspass-radio-item">
                  <input
                    type="radio"
                    name="bus"
                    checked={selectedBus?.bus_number === bus.bus_number}
                    onChange={() => setSelectedBus(bus)}
                  />
                  <span className="buspass-radio-text">
                    {bus.bus_number} – {bus.route}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {error && <p className="buspass-error">{error}</p>}
        {message && <p className="buspass-success">{message}</p>}

        <button type="submit" className="buspass-submit-btn">
          Create Bus Pass
        </button>
      </form>
    </div>
  );
}

export default BusPassForm;
