import "../styles/StudentPassManagement.css";

function FeeSummary({ data }) {
  if (!data) return null;

  return (
    <div className="fee-summary-card">
      <h3>Bus Pass & Fee Details</h3>

      <div className="fee-row">
        <span>Route / City</span>
        <strong>{data.city ?? "-"}</strong>
      </div>

      <div className="fee-row">
        <span>Total Fee</span>
        <strong>₹ {data.total_fee ?? 0}</strong>
      </div>

      <div className="fee-row">
        <span>Total Paid</span>
        <strong>₹ {data.total_paid ?? 0}</strong>
      </div>

      <div className="fee-row">
        <span>Balance</span>
        <strong style={{ color: data.balance === 0 ? "green" : "red" }}>
          ₹ {data.balance ?? 0}
        </strong>
      </div>

      <div className="fee-row">
        <span>Payment Status</span>
        <strong>{data.payment_status ?? "-"}</strong>
      </div>
    </div>
  );
}

export default FeeSummary;
