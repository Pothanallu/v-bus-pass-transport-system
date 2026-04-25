import { useState } from "react";
import "../styles/StudentPassManagement.css";

function AddPaymentForm({ passId, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost/transport_api/student/add_payment.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pass_id: passId,
            amount: amount,
            payment_date: date,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage(`Payment added successfully (${data.receipt_no})`);
        setAmount("");
        setDate("");
        onSuccess(); // refresh fee summary
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h4>Add Payment</h4>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Add Payment"}
        </button>
      </form>

      {message && <p className="success-text">{message}</p>}
    </div>
  );
}

export default AddPaymentForm;
