function AllBuses({ buses = [], counts }) {
  return (
    <>
      {/* SUMMARY COUNTS */}
      <div className="card">
        <h3>All Buses Overview</h3>
        <p>Fleet summary and operational status</p>

        <div className="stats-grid">
          <div className="stat-box">
            <h4>Total Buses</h4>
            <p>{counts.total}</p>
          </div>

          <div className="stat-box success">
            <h4>Active</h4>
            <p>{counts.active}</p>
          </div>

          <div className="stat-box warning">
            <h4>Under Maintenance</h4>
            <p>{counts.maintenance}</p>
          </div>

          <div className="stat-box danger">
            <h4>Not in Service</h4>
            <p>{counts.inactive}</p>
          </div>
        </div>
      </div>

      {/* BUS TABLE */}
      <div className="card">
        <h3>Bus List</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Bus Number</th>
              <th>Model</th>
              <th>Seats</th>
              <th>City</th>
              <th>Route</th>
              <th>Status</th>
              <th>Fitness</th>
            </tr>
          </thead>

          <tbody>
            {buses.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No buses found
                </td>
              </tr>
            ) : (
              buses.map((bus) => (
                <tr key={bus.bus_id}>
                  <td>{bus.bus_number}</td>
                  <td>{bus.bus_model}</td>
                  <td>{bus.seating_capacity}</td>
                  <td>{bus.city || "-"}</td>
                  <td>{bus.route || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${bus.operational_status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {bus.operational_status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        bus.fitness_status === "VALID" ? "active" : "inactive"
                      }`}
                    >
                      {bus.fitness_status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AllBuses;
