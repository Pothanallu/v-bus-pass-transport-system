function BusLocationDetails({ bus }) {
  return (
    <div className="card">
      <h4>Bus Location</h4>

      <p>
        <b>City:</b> {bus.city || "-"}
      </p>
      <p>
        <b>Boarding Point:</b> {bus.route || "-"}
      </p>
    </div>
  );
}

export default BusLocationDetails;
