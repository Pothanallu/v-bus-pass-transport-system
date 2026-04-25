function BusRoutesSummary({ routes }) {
  return (
    <div className="card">
      <h4>Assigned Routes</h4>

      {routes.length === 0 ? (
        <p>No routes assigned</p>
      ) : (
        <ul>
          {routes.map((r) => (
            <li key={r.route_id}>
              <b>{r.route_number}</b> – {r.route_areas}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BusRoutesSummary;
