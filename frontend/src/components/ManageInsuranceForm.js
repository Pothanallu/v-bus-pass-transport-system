import { useState, useEffect } from "react";

function ManageInsuranceForm({ bus, onSuccess }) {
  const [insurance, setInsurance] = useState(null);

  const [form, setForm] = useState({
    insurance_company: "",
    policy_number: "",
    start_date: "",
    expiry_date: "",
  });

  const [errors, setErrors] = useState({});

  /* =========================
     FETCH INSURANCE WHEN BUS CHANGES
  ========================= */
  useEffect(() => {
    if (!bus) return;

    const loadInsurance = async () => {
      try {
        const res = await fetch(
          `http://localhost/transport_api/buses/get_insurance.php?bus_id=${bus.bus_id}`
        );
        const data = await res.json();

        if (data.success && data.data) {
          setInsurance(data.data);
          setForm({
            insurance_company: data.data.insurance_company || "",
            policy_number: data.data.policy_number || "",
            start_date: data.data.start_date || "",
            expiry_date: data.data.expiry_date || "",
          });
        } else {
          // ADD MODE
          setInsurance(null);
          setForm({
            insurance_company: "",
            policy_number: "",
            start_date: "",
            expiry_date: "",
          });
        }
      } catch (err) {
        console.error("Failed to load insurance", err);
      }
    };

    loadInsurance();
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

    if (!form.insurance_company.trim())
      newErrors.insurance_company = "Insurance company is required";

    if (!form.policy_number.trim())
      newErrors.policy_number = "Policy number is required";

    if (!form.start_date) newErrors.start_date = "Start date is required";

    if (!form.expiry_date) newErrors.expiry_date = "Expiry date is required";

    if (
      form.start_date &&
      form.expiry_date &&
      form.expiry_date <= form.start_date
    ) {
      newErrors.expiry_date = "Expiry date must be after start date";
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
        "http://localhost/transport_api/buses/save_insurance.php",
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
      console.error("Insurance save failed", err);
    }
  };

  /* =========================
     NO BUS SELECTED
  ========================= */
  if (!bus) {
    return (
      <div className="card warning-card">
        Please search for a bus to manage insurance.
      </div>
    );
  }

  return (
    <div className="card">
      <h3>{insurance ? "Update Insurance" : "Add Insurance"}</h3>

      <div className="form-grid">
        <div>
          <input
            name="insurance_company"
            placeholder="Insurance Company *"
            value={form.insurance_company}
            onChange={handleChange}
          />
          {errors.insurance_company && (
            <div className="form-error">{errors.insurance_company}</div>
          )}
        </div>

        <div>
          <input
            name="policy_number"
            placeholder="Policy Number *"
            value={form.policy_number}
            onChange={handleChange}
          />
          {errors.policy_number && (
            <div className="form-error">{errors.policy_number}</div>
          )}
        </div>

        <div>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
          />
          {errors.start_date && (
            <div className="form-error">{errors.start_date}</div>
          )}
        </div>

        <div>
          <input
            type="date"
            name="expiry_date"
            value={form.expiry_date}
            onChange={handleChange}
          />
          {errors.expiry_date && (
            <div className="form-error">{errors.expiry_date}</div>
          )}
        </div>
      </div>

      <button className="btn-primary" onClick={handleSubmit}>
        {insurance ? "Update Insurance" : "Add Insurance"}
      </button>
    </div>
  );
}

export default ManageInsuranceForm;
