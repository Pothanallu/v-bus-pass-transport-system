import "../styles/StudentPassManagement.css";

function PaymentHistory({ payments }) {
  if (!payments || payments.length === 0) {
    return <p>No payments recorded.</p>;
  }

  return (
    <div className="card">
      <h4>Payment History</h4>

      <table className="payment-table">
        <thead>
          <tr>
            <th>Receipt No</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, index) => (
            <tr key={index}>
              <td>{p.receipt_no}</td>
              <td>₹ {p.amount}</td>
              <td>{p.payment_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentHistory;
