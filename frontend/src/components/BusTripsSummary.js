function BusTripsSummary({ trips }) {
  return (
    <div className="card">
      <h4>Trips Schedule</h4>

      {trips.length === 0 ? (
        <p>No trips scheduled</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Trip Type</th>
              <th>Time</th>
              <th>Route</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((t) => (
              <tr key={t.trip_id}>
                <td>{t.trip_type}</td>
                <td>{t.trip_time}</td>
                <td>{t.route_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BusTripsSummary;
