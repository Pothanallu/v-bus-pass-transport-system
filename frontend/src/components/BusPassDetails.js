import "../styles/StudentPassManagement.css";

function BusPassDetails({ busPass }) {
  return (
    <div className="card">
      <h3>Bus Pass Details</h3>

      <p>
        <strong>Route / City:</strong> {busPass.city}
      </p>
      <p>
        <strong>Bus Number:</strong> {busPass.bus_no}
      </p>
      <p>
        <strong>Boarding Point:</strong> {busPass.boarding_point}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span className={`status-badge ${busPass.status.toLowerCase()}`}>
          {busPass.status}
        </span>
      </p>
    </div>
  );
}

export default BusPassDetails;
