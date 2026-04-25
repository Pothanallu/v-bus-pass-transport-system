import { useEffect, useState } from "react";

function PendingApprovals({ setActiveTab, setAutoSearchRegNo }) {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/transport_api/student/pending-approvals.php")
      .then((res) => res.json())
      .then((data) => {
        setPendingList(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = (regNo) => {
    setAutoSearchRegNo(regNo); // auto-fill search box
    setActiveTab("student"); // redirect to student search page
  };

  return (
    <div className="spm-content">
      <h2>Pending Approvals (Fee Paid)</h2>
      <p className="subtitle">
        Fee paid students whose bus pass approval is pending.
      </p>

      {loading ? (
        <p>Loading pending approvals...</p>
      ) : pendingList.length === 0 ? (
        <p>No pending approvals found.</p>
      ) : (
        <table className="spm-table">
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Student Name</th>
              <th>Fee Status</th>
              <th>Pass Status</th>
              <th>Search</th>
            </tr>
          </thead>
          <tbody>
            {pendingList.map((student) => (
              <tr key={student.reg_no}>
                <td>{student.reg_no}</td>
                <td>{student.name}</td>
                <td className="paid">Paid</td>
                <td className="pending">Pending</td>
                <td>
                  <button
                    className="search-btn"
                    onClick={() => handleSearch(student.reg_no)}
                  >
                    Search
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PendingApprovals;
