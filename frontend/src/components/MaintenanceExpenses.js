import React, { useState, useEffect } from "react";
import "../styles/FuelMaintenance.css";

const MaintenanceExpenses = ({ bus }) => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    expense_type: "",
    description: "",
    expense_date: "",
    amount: "",
  });

  /* =========================
     LOAD EXPENSES WHEN BUS CHANGES
  ========================= */
  useEffect(() => {
    if (!bus) return;

    fetch(
      `http://localhost/transport_api/expenses/get_maintenance_expenses.php?bus_id=${bus.bus_id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExpenses(data.data);
          setSummary(data.summary);
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
        "http://localhost/transport_api/expenses/save_maintenance_expense.php",
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

        // Reload expenses
        const reload = await fetch(
          `http://localhost/transport_api/expenses/get_maintenance_expenses.php?bus_id=${bus.bus_id}`,
        );
        const reloadData = await reload.json();

        if (reloadData.success) {
          setExpenses(reloadData.data);
          setSummary(reloadData.summary);
        }

        setForm({
          expense_type: "",
          description: "",
          expense_date: "",
          amount: "",
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
        <h3>Maintenance Expenses</h3>
        <p>Please search and select a bus.</p>
      </div>
    );
  }

  return (
    <div className="fm-card">
      <h3>Maintenance Expenses — {bus.bus_number}</h3>

      <form className="fm-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="expense_type"
          placeholder="Expense Type"
          value={form.expense_type}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="date"
          name="expense_date"
          value={form.expense_date}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn-primary">
          Add Expense
        </button>
      </form>

      {message && <div className={`fm-message ${messageType}`}>{message}</div>}

      {summary && (
        <div style={{ marginBottom: "15px" }}>
          <b>Total Expenses:</b> ₹{summary.total_expense}
        </div>
      )}

      {expenses.length > 0 && (
        <table className="fm-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.expense_id}>
                <td>{exp.expense_date}</td>
                <td>{exp.expense_type}</td>
                <td>{exp.description}</td>
                <td>₹ {exp.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MaintenanceExpenses;
