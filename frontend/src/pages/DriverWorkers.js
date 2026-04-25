import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DriverWorkers.css";

/* ================= API LINKS ================= */

const DRIVER_API = "http://localhost/transport_api/Drivers/get_drivers.php";
const WORKER_API = "http://localhost/transport_api/Drivers/get_workers.php";
const ADD_DRIVER_API = "http://localhost/transport_api/Drivers/add_driver.php";
const ADD_WORKER_API = "http://localhost/transport_api/Drivers/add_worker.php";
const UPDATE_DRIVER_API =
  "http://localhost/transport_api/Drivers/update_driver.php";
const BUS_API = "http://localhost/transport_api/Buses/get_buses.php";
const GET_ASSIGNMENTS_API =
  "http://localhost/transport_api/Drivers/get_assignments.php";
const ASSIGN_BUS_API = "http://localhost/transport_api/Drivers/assign_bus.php";
const UPDATE_ASSIGNMENT_STATUS_API =
  "http://localhost/transport_api/Drivers/update_assignment_status.php";
const DELETE_ASSIGNMENT_API =
  "http://localhost/transport_api/Drivers/delete_assignment.php";
const UPDATE_WORKER_API =
  "http://localhost/transport_api/Drivers/update_worker.php";

/* =====================================================
   MAIN COMPONENT
===================================================== */

function DriverWorkers() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [drivers, setDrivers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [buses, setBuses] = useState([]);

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchDrivers();
    fetchWorkers();
    fetchBuses();
  }, []);

  const fetchDrivers = async () => {
    const res = await fetch(DRIVER_API);
    const data = await res.json();
    if (data.success) setDrivers(data.data);
  };

  const fetchWorkers = async () => {
    const res = await fetch(WORKER_API);
    const data = await res.json();
    if (data.success) setWorkers(data.data);
  };

  const fetchBuses = async () => {
    const res = await fetch(BUS_API);
    const data = await res.json();
    if (data.success) setBuses(data.data);
  };

  const handleSearch = () => {
    setSearchInput(searchInput.toLowerCase());
  };

  return (
    <div className="bm-root">
      <div className="topbar">
        <span className="home" onClick={() => navigate("/home")}>
          ← Home
        </span>
        <div>
          <h2>Driver & Bus Workers</h2>
          <p className="subtitle">Transport Officer Module</p>
        </div>
      </div>

      <div className="bm-body">
        {/* SIDEBAR */}
        <div className="spm-sidebar">
          {[
            "dashboard",
            "allDrivers",
            "allWorkers",
            "addDriver",
            "addWorker",
            "assignments",
          ].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (s) => s.toUpperCase())}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="bm-content">
          {(activeTab === "dashboard" ||
            activeTab === "allDrivers" ||
            activeTab === "allWorkers" ||
            activeTab === "welcome") && (
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by ID, Name, Phone, License, Status..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="search-input"
              />
              <button className="btn-primary" onClick={handleSearch}>
                Search
              </button>
            </div>
          )}

          {activeTab === "dashboard" && <Dashboard drivers={drivers} />}
          {activeTab === "allDrivers" && (
            <AllDrivers
              drivers={drivers}
              fetchDrivers={fetchDrivers}
              searchInput={searchInput}
            />
          )}
          {activeTab === "allWorkers" && (
            <AllWorkers
              workers={workers}
              fetchWorkers={fetchWorkers}
              searchInput={searchInput} // 🔥 MUST PASS THIS
            />
          )}

          {activeTab === "addDriver" && (
            <AddDriver fetchDrivers={fetchDrivers} />
          )}
          {activeTab === "addWorker" && (
            <AddWorker fetchWorkers={fetchWorkers} />
          )}
          {activeTab === "assignments" && (
            <BusAssignments
              buses={buses}
              drivers={drivers}
              workers={workers}
              fetchDrivers={fetchDrivers}
              fetchWorkers={fetchWorkers}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DriverWorkers;

/* =====================================================
   DASHBOARD
===================================================== */

const Dashboard = ({ drivers }) => {
  const total = drivers.length;
  const available = drivers.filter((d) => d.status === "Available").length;
  const assigned = drivers.filter((d) => d.status === "Assigned").length;
  const inactive = drivers.filter((d) => d.status === "Inactive").length;

  return (
    <div className="card">
      <h3>Welcome to Driver & Worker Management</h3>
      <ul>
        <li>👨‍✈️ Add and manage drivers</li>
        <li>🧹 Manage helpers and bus workers</li>
        <li>🚌 Assign drivers to buses</li>
        <li>⚠ Track license expiry & availability</li>
      </ul>
      <h3>Driver Statistics Overview</h3>
      <div className="stats-grid">
        <Stat title="Total Drivers" value={total} />
        <Stat title="Available" value={available} type="success" />
        <Stat title="Assigned" value={assigned} type="warning" />
        <Stat title="Inactive" value={inactive} type="danger" />
      </div>
    </div>
  );
};

const Stat = ({ title, value, type }) => (
  <div className={`stat-box ${type || ""}`}>
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

/* =====================================================
   ALL DRIVERS (FINAL WORKING VERSION)
===================================================== */
const AllDrivers = ({ drivers = [], fetchDrivers, searchInput = "" }) => {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= SEARCH FILTER ================= */

  const filtered = drivers.filter((d) => {
    const search = searchInput.trim().toLowerCase();

    if (!search) return true;

    // 🔥 If search is only numbers → match driver_id exactly
    if (/^\d+$/.test(search)) {
      return String(d.driver_id) === search;
    }

    // 🔥 Otherwise normal search
    return (
      (d.name && d.name.toLowerCase().includes(search)) ||
      (d.phone && d.phone.toLowerCase().includes(search)) ||
      (d.license_no && d.license_no.toLowerCase().includes(search)) ||
      (d.status && d.status.toLowerCase().includes(search))
    );
  });

  /* ================= EDIT ================= */

  const handleEdit = (driver) => {
    setEditId(driver.driver_id);
    setEditData({ ...driver });
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(UPDATE_DRIVER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driver_id: editData.driver_id,
          name: editData.name,
          phone: editData.phone,
          status: editData.status,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEditId(null);
        fetchDrivers(); // refresh table
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network error");
    }

    setLoading(false);
  };

  /* ================= UI ================= */

  return (
    <div className="card">
      <h3>All Drivers</h3>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>License</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No drivers found
              </td>
            </tr>
          ) : (
            filtered.map((d) => (
              <tr key={d.driver_id}>
                {/* ID */}
                <td style={{ fontWeight: "600" }}>{d.driver_id}</td>

                {/* NAME */}
                <td>
                  {editId === d.driver_id ? (
                    <input
                      value={editData.name || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    d.name
                  )}
                </td>

                {/* PHONE */}
                <td>
                  {editId === d.driver_id ? (
                    <input
                      value={editData.phone || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          phone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    d.phone
                  )}
                </td>

                {/* LICENSE */}
                <td>{d.license_no}</td>

                {/* STATUS */}
                <td>
                  {editId === d.driver_id ? (
                    <select
                      value={editData.status || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Available">Available</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    <span className={`badge ${d.status?.toLowerCase()}`}>
                      {d.status}
                    </span>
                  )}
                </td>

                {/* ACTION */}
                <td>
                  {editId === d.driver_id ? (
                    <>
                      <button
                        className="btn-primary"
                        disabled={loading}
                        onClick={handleSave}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>

                      <button
                        style={{ marginLeft: "8px" }}
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={() => handleEdit(d)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
/* =====================================================
   ADD DRIVER (MANUAL INDIAN LICENSE FORMAT)
===================================================== */

const AddDriver = ({ fetchDrivers }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    license_no: "",
    expiry: "",
    status: "Available",
  });

  const validateLicense = (license) => {
    const regex = /^[A-Z]{2}-\d{2}-\d{4}-\d{7}$/;
    return regex.test(license);
  };

  const handleSubmit = async () => {
    if (!form.name || form.phone.length !== 10 || !form.expiry) {
      alert("Please fill all required fields correctly");
      return;
    }

    if (!validateLicense(form.license_no)) {
      alert("Invalid License Format.\nUse format: AP-26-2023-1234567");
      return;
    }

    const formattedPhone = `+91${form.phone}`;

    try {
      const res = await fetch(ADD_DRIVER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: formattedPhone,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Driver added successfully");
        fetchDrivers();

        setForm({
          name: "",
          phone: "",
          license_no: "",
          expiry: "",
          status: "Available",
        });
      } else {
        alert(data.message || "Failed to add driver");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="card">
      <h3>Add New Driver</h3>

      <div className="driver-form-grid">
        {/* Driver Name */}
        <input
          type="text"
          placeholder="Driver Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Phone */}
        <div className="phone-wrapper">
          <span className="phone-prefix">🇮🇳 +91</span>
          <input
            type="tel"
            maxLength="10"
            placeholder="Enter 10-digit number"
            value={form.phone}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, "");
              if (onlyDigits.length <= 10) {
                setForm({ ...form, phone: onlyDigits });
              }
            }}
          />
        </div>

        {/* License Number */}
        <input
          type="text"
          placeholder="License No (AP-26-2023-1234567)"
          value={form.license_no}
          onChange={(e) =>
            setForm({
              ...form,
              license_no: e.target.value.toUpperCase(),
            })
          }
        />

        {/* Expiry Date */}
        <input
          type="date"
          value={form.expiry}
          onChange={(e) => setForm({ ...form, expiry: e.target.value })}
        />

        {/* Status */}
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Available">Available</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button className="btn-primary" onClick={handleSubmit}>
          Add Driver
        </button>
      </div>
    </div>
  );
};

/* =====================================================
   ALL WORKERS – FINAL VERSION WITH SEARCH + WORKER_ID
===================================================== */

const AllWorkers = ({ workers = [], fetchWorkers, searchInput = "" }) => {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= SEARCH FILTER ================= */

  const filtered = workers.filter((w) => {
    const search = searchInput.trim().toLowerCase();

    if (!search) return true;

    // 🔥 If numeric search → match worker_id exactly
    if (/^\d+$/.test(search)) {
      return String(w.worker_id) === search;
    }

    // 🔥 Normal text search
    return (
      (w.name && w.name.toLowerCase().includes(search)) ||
      (w.role && w.role.toLowerCase().includes(search)) ||
      (w.phone && w.phone.toLowerCase().includes(search)) ||
      (w.status && w.status.toLowerCase().includes(search))
    );
  });

  /* ================= EDIT ================= */

  const handleEdit = (worker) => {
    setEditId(worker.worker_id);
    setEditData({ ...worker });
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(UPDATE_WORKER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          worker_id: editData.worker_id,
          name: editData.name,
          status: editData.status,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEditId(null);
        fetchWorkers();
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network error");
    }

    setLoading(false);
  };

  /* ================= UI ================= */

  return (
    <div className="card">
      <h3>All Workers</h3>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No workers found
              </td>
            </tr>
          ) : (
            filtered.map((w) => (
              <tr key={w.worker_id}>
                {/* ID */}
                <td style={{ fontWeight: "600" }}>{w.worker_id}</td>

                {/* NAME */}
                <td>
                  {editId === w.worker_id ? (
                    <input
                      value={editData.name || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    w.name
                  )}
                </td>

                {/* ROLE */}
                <td>{w.role}</td>

                {/* PHONE */}
                <td>{w.phone}</td>

                {/* STATUS */}
                <td>
                  {editId === w.worker_id ? (
                    <select
                      value={editData.status || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Available">Available</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    <span className={`badge ${w.status?.toLowerCase()}`}>
                      {w.status}
                    </span>
                  )}
                </td>

                {/* ACTION */}
                <td>
                  {editId === w.worker_id ? (
                    <>
                      <button
                        className="btn-primary"
                        disabled={loading}
                        onClick={handleSave}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>

                      <button
                        style={{ marginLeft: "8px" }}
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={() => handleEdit(w)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
/* =====================================================
   ADD WORKER (DB CONNECTED)
===================================================== */

const AddWorker = ({ fetchWorkers }) => {
  const [form, setForm] = useState({
    name: "",
    role: "",
    phone: "",
    status: "Available",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.role || form.phone.length !== 10) {
      alert("Please fill all required fields with valid phone number");
      return;
    }

    const formattedPhone = `+91${form.phone}`;

    try {
      const res = await fetch(ADD_WORKER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: formattedPhone,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Worker added successfully");
        fetchWorkers();

        setForm({
          name: "",
          role: "",
          phone: "",
          status: "Available",
        });
      } else {
        alert(data.message || "Failed to add worker");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="card">
      <h3>Add New Worker</h3>

      <div className="driver-form-grid">
        {/* Name */}
        <input
          type="text"
          placeholder="Enter Worker Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Phone */}
        <div className="phone-wrapper">
          <span className="phone-prefix">🇮🇳 +91</span>
          <input
            type="tel"
            maxLength="10"
            placeholder="Enter 10-digit number"
            value={form.phone}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, "");
              if (onlyDigits.length <= 10) {
                setForm({
                  ...form,
                  phone: onlyDigits,
                });
              }
            }}
          />
        </div>

        {/* Role */}
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="">Select Role</option>
          <option value="Cleaner">Cleaner</option>
          <option value="Helper">Helper</option>
          <option value="Attender">Attender</option>
        </select>

        <button className="btn-primary" onClick={handleSubmit}>
          Add Worker
        </button>
      </div>
    </div>
  );
};

/* =====================================================
   BUS ASSIGNMENTS – FINAL LOCKED STABLE VERSION
===================================================== */
/* =====================================================
   BUS ASSIGNMENTS – FINAL COMPLETE VERSION
===================================================== */

const BusAssignments = ({
  buses = [],
  drivers = [],
  workers = [],
  fetchDrivers,
  fetchWorkers,
}) => {
  const [form, setForm] = useState({
    bus: "",
    driver: "",
    worker: "",
  });

  const [assignments, setAssignments] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  /* ================= LOAD ASSIGNMENTS ================= */

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch(GET_ASSIGNMENTS_API);
      const data = await res.json();
      if (data.success) {
        setAssignments(data.data || []);
      }
    } catch (error) {
      console.error("Assignment Fetch Error:", error);
    }
  };

  /* ================= LOCK LOGIC ================= */

  const activeAssignments = assignments.filter(
    (a) => a.status?.toLowerCase() !== "completed",
  );

  const isBusAssigned = (busNumber) =>
    activeAssignments.some((a) => a.bus_number === busNumber);

  const isDriverAssigned = (driverId) =>
    activeAssignments.some((a) => Number(a.driver_id) === Number(driverId));

  const isWorkerAssigned = (workerId) =>
    activeAssignments.some((a) => Number(a.worker_id) === Number(workerId));

  /* ================= ASSIGN BUS ================= */

  const handleAssign = async () => {
    if (!form.bus || !form.driver) {
      alert("Select bus and driver");
      return;
    }

    if (isBusAssigned(form.bus)) {
      alert("Bus already assigned");
      return;
    }

    if (isDriverAssigned(form.driver)) {
      alert("Driver already assigned");
      return;
    }

    if (form.worker && isWorkerAssigned(form.worker)) {
      alert("Worker already assigned");
      return;
    }

    try {
      const res = await fetch(ASSIGN_BUS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bus_number: form.bus,
          driver_id: form.driver,
          worker_id: form.worker || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        fetchAssignments();
        fetchDrivers?.();
        fetchWorkers?.();
        setForm({ bus: "", driver: "", worker: "" });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Assign Error:", error);
    }
  };

  /* ================= UPDATE STATUS ================= */

  const handleUpdateStatus = async (id) => {
    try {
      const res = await fetch(UPDATE_ASSIGNMENT_STATUS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment_id: id,
          status: editStatus,
        }),
      });

      const data = await res.json();

      if (data.success) {
        fetchAssignments();
        fetchDrivers?.();
        fetchWorkers?.();
        setEditingId(null);
      }
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;

    try {
      const res = await fetch(DELETE_ASSIGNMENT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignment_id: id }),
      });

      const data = await res.json();

      if (data.success) {
        fetchAssignments();
        fetchDrivers?.();
        fetchWorkers?.();
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  /* ================= BADGE ================= */

  const renderBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "pending") return <span className="badge pending">Pending</span>;
    if (s === "assigned") return <span className="badge active">Assigned</span>;
    if (s === "completed")
      return <span className="badge completed">Completed</span>;
    return "-";
  };

  /* ================= BUS LOOKUP ================= */

  const selectedDetails = assignments.find((a) => a.bus_number === selectedBus);

  /* ================= UI ================= */

  return (
    <div className="card">
      <h3>Bus Assignments</h3>

      {/* ================= ASSIGN FORM ================= */}
      <div className="driver-form-grid">
        <select
          value={form.bus}
          onChange={(e) => setForm({ ...form, bus: e.target.value })}
        >
          <option value="">Select Bus</option>
          {buses.map((b) => (
            <option
              key={b.bus_id}
              value={b.bus_number}
              disabled={isBusAssigned(b.bus_number)}
            >
              {b.bus_number}
              {isBusAssigned(b.bus_number) ? " (Assigned)" : ""}
            </option>
          ))}
        </select>

        <select
          value={form.driver}
          onChange={(e) => setForm({ ...form, driver: e.target.value })}
        >
          <option value="">Select Driver</option>
          {drivers.map((d) => (
            <option
              key={d.driver_id}
              value={d.driver_id}
              disabled={isDriverAssigned(d.driver_id)}
            >
              {d.name}
              {isDriverAssigned(d.driver_id) ? " (Assigned)" : ""}
            </option>
          ))}
        </select>

        <select
          value={form.worker}
          onChange={(e) => setForm({ ...form, worker: e.target.value })}
        >
          <option value="">Select Worker</option>
          {workers.map((w) => (
            <option
              key={w.worker_id}
              value={w.worker_id}
              disabled={isWorkerAssigned(w.worker_id)}
            >
              {w.name}
              {isWorkerAssigned(w.worker_id) ? " (Assigned)" : ""}
            </option>
          ))}
        </select>

        <button className="btn-primary" onClick={handleAssign}>
          Assign
        </button>
      </div>

      {/* ================= BUS LOOKUP ================= */}

      <h3 style={{ marginTop: "30px" }}>Bus Lookup</h3>

      <select
        value={selectedBus}
        onChange={(e) => setSelectedBus(e.target.value)}
      >
        <option value="">Select Bus</option>
        {buses.map((b) => (
          <option key={b.bus_id} value={b.bus_number}>
            {b.bus_number}
          </option>
        ))}
      </select>

      {selectedBus && (
        <div style={{ marginTop: "15px" }}>
          <p>
            <strong>Driver:</strong>{" "}
            {selectedDetails?.driver_name || "Not Assigned"}
          </p>
          <p>
            <strong>Worker:</strong>{" "}
            {selectedDetails?.worker_name || "Not Assigned"}
          </p>
          <p>
            <strong>Status:</strong> {selectedDetails?.status || "Not Assigned"}
          </p>
        </div>
      )}

      {/* ================= ASSIGNMENT TABLE ================= */}

      <table className="data-table" style={{ marginTop: "30px" }}>
        <thead>
          <tr>
            <th>Bus</th>
            <th>Driver</th>
            <th>Worker</th>
            <th>Status</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((a) => (
            <tr key={a.assignment_id}>
              <td>{a.bus_number}</td>
              <td>{a.driver_name}</td>
              <td>{a.worker_name || "-"}</td>
              <td>{renderBadge(a.status)}</td>

              <td>
                {editingId === a.assignment_id ? (
                  <>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      className="btn-primary"
                      onClick={() => handleUpdateStatus(a.assignment_id)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setEditingId(a.assignment_id);
                      setEditStatus(a.status);
                    }}
                  >
                    Edit
                  </button>
                )}
              </td>

              <td>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(a.assignment_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
