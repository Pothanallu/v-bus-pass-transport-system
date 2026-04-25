import { useState, useEffect } from "react";

function ManageBusForm({ bus, onSuccess }) {
  const [form, setForm] = useState({
    bus_number: "",
    bus_model: "",
    seating_capacity: "",
    manufacturing_year: "",
    operational_status: "Active",
    remarks: "",
  });

  const [errors, setErrors] = useState({});

  /* =========================
     PREFILL WHEN BUS EXISTS
  ========================= */
  useEffect(() => {
    if (bus) {
      setForm({
        bus_number: bus.bus_number || "",
        bus_model: bus.bus_model || "",
        seating_capacity: bus.seating_capacity || "",
        manufacturing_year: bus.manufacturing_year || "",
        operational_status: bus.operational_status || "Active",
        remarks: bus.remarks || "",
      });
    } else {
      setForm({
        bus_number: "",
        bus_model: "",
        seating_capacity: "",
        manufacturing_year: "",
        operational_status: "Active",
        remarks: "",
      });
    }
    setErrors({});
  }, [bus]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  /* =========================
     VALIDATION
  ========================= */
  const validate = () => {
    const newErrors = {};
    const year = Number(form.manufacturing_year);
    const currentYear = new Date().getFullYear();

    if (!form.bus_number.trim())
      newErrors.bus_number = "Bus number is required";

    if (!form.bus_model.trim()) newErrors.bus_model = "Bus model is required";

    if (!form.seating_capacity)
      newErrors.seating_capacity = "Seating capacity is required";

    if (!form.manufacturing_year)
      newErrors.manufacturing_year = "Manufacturing year is required";
    else if (year < 1990 || year > currentYear)
      newErrors.manufacturing_year = "Enter a valid year";

    if (!form.operational_status)
      newErrors.operational_status = "Operational status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await fetch(
        "http://localhost/transport_api/buses/save_bus.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (data.success) {
        onSuccess && onSuccess();
      } else {
        setErrors({ submit: data.message || "Failed to save bus" });
      }
    } catch (err) {
      setErrors({ submit: "Server error. Please try again." });
    }
  };

  return (
    <div className="card">
      <h3>{bus ? "Update Bus" : "Add New Bus"}</h3>

      <div className="form-grid">
        {/* Bus Number */}
        <div>
          <input
            name="bus_number"
            placeholder="Bus Number *"
            value={form.bus_number}
            onChange={handleChange}
            disabled={!!bus}
          />
          {errors.bus_number && (
            <div className="form-error">{errors.bus_number}</div>
          )}
        </div>

        {/* Bus Model */}
        <div>
          <input
            name="bus_model"
            placeholder="Bus Model *"
            value={form.bus_model}
            onChange={handleChange}
          />
          {errors.bus_model && (
            <div className="form-error">{errors.bus_model}</div>
          )}
        </div>

        {/* Seating Capacity */}
        <div>
          <input
            type="number"
            name="seating_capacity"
            placeholder="Seating Capacity *"
            value={form.seating_capacity}
            onChange={handleChange}
          />
          {errors.seating_capacity && (
            <div className="form-error">{errors.seating_capacity}</div>
          )}
        </div>

        {/* Manufacturing Year */}
        <div>
          <input
            type="number"
            name="manufacturing_year"
            placeholder="Manufacturing Year *"
            value={form.manufacturing_year}
            onChange={handleChange}
          />
          {errors.manufacturing_year && (
            <div className="form-error">{errors.manufacturing_year}</div>
          )}
        </div>

        {/* Operational Status */}
        <div>
          <select
            name="operational_status"
            value={form.operational_status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Not in Service">Not in Service</option>
          </select>
          {errors.operational_status && (
            <div className="form-error">{errors.operational_status}</div>
          )}
        </div>

        {/* Remarks */}
        <input
          name="remarks"
          placeholder="Remarks (optional)"
          value={form.remarks}
          onChange={handleChange}
        />
      </div>

      {errors.submit && <div className="form-error">{errors.submit}</div>}

      <button className="btn-primary" onClick={handleSubmit}>
        {bus ? "Update Bus" : "Add Bus"}
      </button>
    </div>
  );
}

export default ManageBusForm;
