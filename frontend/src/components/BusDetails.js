function BusDetails({ bus }) {
  return (
    <div className="card bus-details-card">
      <h4>Bus Details</h4>

      <p>
        <b>Bus Number:</b> {bus.bus_number}
      </p>
      <p>
        <b>Model:</b> {bus.bus_model}
      </p>
      <p>
        <b>Seating Capacity:</b> {bus.seating_capacity}
      </p>
      <p>
        <b>Status:</b>{" "}
        <span
          className={`bus-status status-${bus.operational_status
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {bus.operational_status}
        </span>
      </p>
    </div>
  );
}

export default BusDetails;
