import { useState } from "react";
import "../styles/StudentPassManagement.css";

function ApproveRejectActions({ passId, paymentStatus, onUpdate }) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status) => {
    setMessage("");
    setError("");

    // Validation rules
    if (status === "Approved" && paymentStatus !== "Fully Paid") {
      setError("Cannot approve. Fee is not fully paid.");
      return;
    }

    if (status === "Rejected" && reason.trim() === "") {
      setError("Rejection reason is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost/transport_api/student/update_pass_status.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pass_id: passId,
            status: status,
            rejection_reason: status === "Rejected" ? reason : "",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setReason("");
        onUpdate(); // refresh fee + pass status
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card actions-box">
      <h4>Approval Actions</h4>

      {/* APPROVE */}
      <button
        className="approve"
        disabled={loading}
        onClick={() => updateStatus("Approved")}
      >
        {loading ? "Processing..." : "Approve Bus Pass"}
      </button>

      {/* REJECT */}
      <div>
        <textarea
          placeholder="Enter rejection reason (mandatory for rejection)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <button
          className="reject"
          disabled={loading}
          onClick={() => updateStatus("Rejected")}
        >
          Reject Bus Pass
        </button>
      </div>

      {/* MESSAGES */}
      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default ApproveRejectActions;
