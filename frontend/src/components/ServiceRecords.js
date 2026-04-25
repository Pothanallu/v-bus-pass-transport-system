import React, { useState, useEffect } from "react";
import "../styles/FuelMaintenance.css";

const ServiceRecords = ({ bus }) => {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    service_type: "",
    service_date: "",
    next_service_due: "",
    service_center: "",
    cost: "",
    remarks: "",
  });

  /* =========================
     LOAD RECORDS
  ========================= */
  useEffect(() => {
    if (!bus) return;

    fetch(
      `http://localhost/transport_api/expenses/get_service_records.php?bus_id=${bus.bus_id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecords(data.data);
        }
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
        "http://localhost/transport_api/expenses/save_service_record.php",
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
        setMessage(data.message);
        setMessageType("success");

        // Reload records
        const reload = await fetch(
          `http://localhost/transport_api/expenses/get_service_records.php?bus_id=${bus.bus_id}`,
        );
        const reloadData = await reload.json();

        if (reloadData.success) {
          setRecords(reloadData.data);
        }

        setForm({
          service_type: "",
          service_date: "",
          next_service_due: "",
          service_center: "",
          cost: "",
          remarks: "",
        });
      } else {
        setMessage(data.message);
        setMessageType("error");
      }

      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Server error occurred");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!bus) {
    return (
      <div className="fm-card">
        <h3>Service Records</h3>
        <p>Please search and select a bus.</p>
      </div>
    );
  }

  return (
    <div className="fm-card">
      <h3>Service Records — {bus.bus_number}</h3>

      <form className="fm-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="service_type"
          placeholder="Service Type"
          value={form.service_type}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="service_date"
          value={form.service_date}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="next_service_due"
          value={form.next_service_due}
          onChange={handleChange}
        />

        <input
          type="text"
          name="service_center"
          placeholder="Service Center"
          value={form.service_center}
          onChange={handleChange}
        />

        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={form.cost}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="remarks"
          placeholder="Remarks"
          value={form.remarks}
          onChange={handleChange}
        />

        <button type="submit" className="btn-primary">
          Add Service Record
        </button>
      </form>

      {message && <div className={`fm-message ${messageType}`}>{message}</div>}

      {records.length > 0 && (
        <table className="fm-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Next Due</th>
              <th>Center</th>
              <th>Cost</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.service_id}>
                <td>{rec.service_date}</td>
                <td>{rec.service_type}</td>
                <td>{rec.next_service_due}</td>
                <td>{rec.service_center}</td>
                <td>₹ {rec.cost}</td>
                <td>{rec.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ServiceRecords;
