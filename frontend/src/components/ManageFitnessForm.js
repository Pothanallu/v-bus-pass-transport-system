import { useState, useEffect } from "react";

function ManageFitnessForm({ bus, inspection, onSuccess }) {
  const [form, setForm] = useState({
    fitness_certificate_no: "",
    fitness_issued_date: "",
    fitness_expiry_date: "",
    condition_status: "Good",
    remarks: "",
  });

  const [errors, setErrors] = useState({});

  /* =========================
     PREFILL WHEN FITNESS EXISTS
  ========================= */
  useEffect(() => {
    if (inspection) {
      setForm({
        fitness_certificate_no: inspection.fitness_certificate_no || "",
        fitness_issued_date: inspection.fitness_issued_date || "",
        fitness_expiry_date: inspection.fitness_expiry_date || "",
        condition_status: inspection.condition_status || "Good",
        remarks: inspection.remarks || "",
      });
    }
  }, [inspection]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  /* =========================
     VALIDATION
  ========================= */
  const validate = () => {
    const newErrors = {};

    if (!form.fitness_certificate_no.trim())
      newErrors.fitness_certificate_no = "Certificate number is required";

    if (!form.fitness_issued_date)
      newErrors.fitness_issued_date = "Issued date is required";

    if (!form.fitness_expiry_date)
      newErrors.fitness_expiry_date = "Expiry date is required";

    if (
      form.fitness_issued_date &&
      form.fitness_expiry_date &&
      form.fitness_expiry_date <= form.fitness_issued_date
    ) {
      newErrors.fitness_expiry_date = "Expiry date must be after issued date";
    }

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
        "http://localhost/transport_api/buses/save_fitness.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bus_id: bus.bus_id,
            ...form,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        onSuccess && onSuccess();
      }
    } catch (err) {
      console.error("Fitness save failed", err);
    }
  };

  if (!bus) {
    return (
      <div className="card warning-card">
        Please search for a bus to manage fitness.
      </div>
    );
  }

  return (
    <div className="card">
      <h3>{inspection ? "Update Fitness" : "Add Fitness"}</h3>

      <div className="form-grid">
        {/* Certificate */}
        <div>
          <input
            name="fitness_certificate_no"
            placeholder="Fitness Certificate No *"
            value={form.fitness_certificate_no}
            onChange={handleChange}
          />
          {errors.fitness_certificate_no && (
            <div className="form-error">{errors.fitness_certificate_no}</div>
          )}
        </div>

        {/* Condition */}
        <div>
          <select
            name="condition_status"
            value={form.condition_status}
            onChange={handleChange}
          >
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        {/* Issued Date */}
        <div>
          <input
            type="date"
            name="fitness_issued_date"
            value={form.fitness_issued_date}
            onChange={handleChange}
          />
          {errors.fitness_issued_date && (
            <div className="form-error">{errors.fitness_issued_date}</div>
          )}
        </div>

        {/* Expiry Date */}
        <div>
          <input
            type="date"
            name="fitness_expiry_date"
            value={form.fitness_expiry_date}
            onChange={handleChange}
          />
          {errors.fitness_expiry_date && (
            <div className="form-error">{errors.fitness_expiry_date}</div>
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

      <button className="btn-primary" onClick={handleSubmit}>
        {inspection ? "Update Fitness" : "Add Fitness"}
      </button>
    </div>
  );
}

export default ManageFitnessForm;
