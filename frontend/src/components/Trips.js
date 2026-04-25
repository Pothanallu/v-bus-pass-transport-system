import React, { useEffect, useState } from "react";

function Trips() {
  const [trips, setTrips] = useState([]);
  const [editTrip, setEditTrip] = useState(null);
  const [routes, setRoutes] = useState([]);

  const loadTrips = () => {
    fetch("http://localhost/transport_api/buses/getTrips.php")
      .then((res) => res.json())
      .then((data) => data.success && setTrips(data.data));
  };

  const loadRoutes = () => {
    fetch("http://localhost/transport_api/buses/getRoutes.php")
      .then((res) => res.json())
      .then((data) => data.success && setRoutes(data.data));
  };

  useEffect(() => {
    loadTrips();
    loadRoutes();
  }, []);

  const saveTrip = async () => {
    const res = await fetch(
      "http://localhost/transport_api/buses/updateTrip.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTrip),
      },
    );

    const result = await res.json();

    if (result.success) {
      alert("Trip updated");
      setEditTrip(null);
      loadTrips();
    } else {
      alert("Update failed");
    }
  };

  return (
    <div className="card">
      <h3>Bus Trips</h3>

      <table className="data-table">
        <thead>
          <tr>
            <th>Bus</th>
            <th>City</th>
            <th>Boarding Point</th>
            <th>Route No</th>
            <th>Trip Type</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {trips.map((t) => (
            <React.Fragment key={t.trip_id}>
              <tr>
                <td>{t.bus_number}</td>
                <td>{t.bus_city}</td>
                <td>{t.boarding_point}</td>
                <td>{t.route_number}</td>
                <td>{t.trip_type}</td>
                <td>{t.trip_time}</td>
                <td>
                  <button onClick={() => setEditTrip(t)}>Edit</button>
                </td>
              </tr>

              {editTrip && editTrip.trip_id === t.trip_id && (
                <tr className="edit-row">
                  <td colSpan="7">
                    <div className="inline-edit">
                      <div className="field">
                        <label>Route</label>
                        <select
                          value={editTrip.route_id}
                          onChange={(e) =>
                            setEditTrip({
                              ...editTrip,
                              route_id: Number(e.target.value),
                            })
                          }
                        >
                          {routes.map((r) => (
                            <option key={r.route_id} value={r.route_id}>
                              {r.route_number}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="field">
                        <label>Trip Type</label>
                        <select
                          value={editTrip.trip_type}
                          onChange={(e) =>
                            setEditTrip({
                              ...editTrip,
                              trip_type: e.target.value,
                            })
                          }
                        >
                          <option>Morning</option>
                          <option>Evening</option>
                        </select>
                      </div>

                      <div className="field">
                        <label>Trip Time</label>
                        <input
                          type="time"
                          value={editTrip.trip_time}
                          onChange={(e) =>
                            setEditTrip({
                              ...editTrip,
                              trip_time: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="actions">
                        <button onClick={saveTrip}>Save</button>
                        <button onClick={() => setEditTrip(null)}>
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

export default Trips;
