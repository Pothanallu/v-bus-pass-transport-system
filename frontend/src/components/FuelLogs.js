import React, { useState, useEffect } from "react";
import "../styles/FuelMaintenance.css";

const FuelLogs = ({ bus }) => {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    fuel_date: "",
    liters: "",
    cost: "",
    odometer_reading: "",
  });

  /* =========================
     LOAD LOGS WHEN BUS CHANGES
  ========================= */
  useEffect(() => {
    if (!bus) return;

    fetch(
      `http://localhost/transport_api/expenses/get_fuel_logs.php?bus_id=${bus.bus_id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.data);
          setSummary(data.summary);
        }
      })
      .catch(() => {
        setMessage("Failed to load fuel logs");
        setMessageType("error");
      });
  }, [bus]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bus) return;

    try {
      const res = await fetch(
        "http://localhost/transport_api/expenses/save_fuel_log.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bus_id: bus.bus_id,
            ...form,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setMessage(data.message || "Fuel added successfully");
        setMessageType("success");

        // Reload logs
        const reload = await fetch(
          `http://localhost/transport_api/expenses/get_fuel_logs.php?bus_id=${bus.bus_id}`,
        );
        const reloadData = await reload.json();

        if (reloadData.success) {
          setLogs(reloadData.data);
          setSummary(reloadData.summary);
        }

        setForm({
          fuel_date: "",
          liters: "",
          cost: "",
          odometer_reading: "",
        });
      } else {
        setMessage(data.message || "Failed to add fuel");
        setMessageType("error");
      }

      // Auto hide message
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch {
      setMessage("Server error occurred");
      setMessageType("error");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  if (!bus) {
    return (
      <div className="fm-card">
        <h3>Fuel Logs</h3>
        <p>Please search and select a bus.</p>
      </div>
    );
  }

  return (
    <div className="fm-card">
      <h3>Fuel Logs — {bus.bus_number}</h3>

      <form className="fm-form" onSubmit={handleSubmit}>
        <input
          type="date"
          name="fuel_date"
          value={form.fuel_date}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="odometer_reading"
          placeholder="Odometer"
          value={form.odometer_reading}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="liters"
          placeholder="Liters"
          value={form.liters}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={form.cost}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn-primary">
          Add Fuel Entry
        </button>
      </form>

      {/* MESSAGE */}
      {message && <div className={`fm-message ${messageType}`}>{message}</div>}

      {summary && (
        <div style={{ marginBottom: "15px" }}>
          <b>Total Fuel:</b> {summary.total_fuel} L | <b>Total Cost:</b> ₹
          {summary.total_cost} | <b>Avg Mileage:</b> {summary.average_mileage}{" "}
          km/l
        </div>
      )}

      {logs.length > 0 && (
        <table className="fm-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Odometer</th>
              <th>Liters</th>
              <th>Cost</th>
              <th>Mileage</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.fuel_id}>
                <td>{log.fuel_date}</td>
                <td>{log.odometer_reading}</td>
                <td>{log.liters}</td>
                <td>₹ {log.cost}</td>
                <td>{log.mileage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FuelLogs;
