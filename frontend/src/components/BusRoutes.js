import React, { useEffect, useState } from "react";

function BusRoutes() {
  const [routes, setRoutes] = useState([]);
  const [editRoute, setEditRoute] = useState(null);

  const loadRoutes = () => {
    fetch("http://localhost/transport_api/buses/getRoutes.php")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setRoutes(result.data);
      });
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const saveRoute = async () => {
    try {
      const res = await fetch(
        "http://localhost/transport_api/buses/updateRouteWithBus.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editRoute),
        },
      );

      const result = await res.json();

      if (result.success) {
        alert("Route updated successfully");
        setEditRoute(null);
        loadRoutes();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Network / CORS error");
    }
  };

  return (
    <div className="card">
      <h3>Bus Routes</h3>

      <table className="data-table">
        <thead>
          <tr>
            <th>Route No</th>
            <th>Bus</th>
            <th>City</th>
            <th>Boarding Point</th>
            <th>Route Areas</th>
            <th>Destination</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {routes.map((r) => (
            <React.Fragment key={r.route_id}>
              <tr>
                <td>{r.route_number}</td>
                <td>{r.bus_number}</td>
                <td>{r.bus_city}</td>
                <td>{r.boarding_point}</td>
                <td>{r.route_areas}</td>
                <td>{r.destination}</td>
                <td>
                  <button onClick={() => setEditRoute(r)}>Edit</button>
                </td>
              </tr>

              {editRoute && editRoute.route_id === r.route_id && (
                <tr className="edit-row">
                  <td colSpan="7">
                    <div className="inline-edit">
                      <div className="field">
                        <label>City</label>
                        <input
                          value={editRoute.bus_city}
                          onChange={(e) =>
                            setEditRoute({
                              ...editRoute,
                              bus_city: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="field">
                        <label>Boarding Point</label>
                        <input
                          value={editRoute.boarding_point}
                          onChange={(e) =>
                            setEditRoute({
                              ...editRoute,
                              boarding_point: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="field">
                        <label>Route Areas</label>
                        <input
                          value={editRoute.route_areas}
                          onChange={(e) =>
                            setEditRoute({
                              ...editRoute,
                              route_areas: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="field">
                        <label>Destination</label>
                        <input
                          value={editRoute.destination}
                          onChange={(e) =>
                            setEditRoute({
                              ...editRoute,
                              destination: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="actions">
                        <button onClick={saveRoute}>Save</button>
                        <button onClick={() => setEditRoute(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BusRoutes;
