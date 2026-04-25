import { useState, useEffect, useCallback, useRef } from "react";
import "../styles/StudentPassManagement.css";

function StudentSearch({ onStudentFound, autoSearchRegNo }) {
  const [regNo, setRegNo] = useState("");
  const [error, setError] = useState("");
  const lastAutoSearched = useRef(null);

  /* =========================
     SEARCH FUNCTION (STABLE)
  ========================= */
  const handleSearch = useCallback(
    async (searchRegNo) => {
      setError("");

      const finalRegNo = searchRegNo || regNo;
      if (!finalRegNo) return;

      try {
        const res = await fetch(
          `http://localhost/transport_api/student/search.php?reg_no=${finalRegNo}`,
        );
        const data = await res.json();

        if (data.success) {
          onStudentFound(data.student, data.bus_pass);
        } else {
          setError(data.message || "Student not found");
        }
      } catch (err) {
        setError("Search failed. Please try again.");
        console.error(err);
      }
    },
    [regNo, onStudentFound],
  );

  /* =========================
     AUTO SEARCH (CONTROLLED)
  ========================= */
  useEffect(() => {
    if (autoSearchRegNo && autoSearchRegNo !== lastAutoSearched.current) {
      lastAutoSearched.current = autoSearchRegNo;
      setRegNo(autoSearchRegNo);
      handleSearch(autoSearchRegNo);
    }
  }, [autoSearchRegNo, handleSearch]);

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Enter Registration Number"
        value={regNo}
        onChange={(e) => setRegNo(e.target.value)}
      />

      <button onClick={() => handleSearch()}>Search</button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default StudentSearch;
