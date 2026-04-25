function StudentPassSidebar({ activeTab, setActiveTab, hasPass, hasStudent }) {
  return (
    <div className="spm-sidebar">
      {/* Student Details */}
      <button
        disabled={!hasStudent}
        className={activeTab === "student" ? "active" : ""}
        onClick={() => setActiveTab("student")}
      >
        Student Details
      </button>

      {/* Create Pass */}
      <button
        disabled={!hasStudent}
        className={activeTab === "create" ? "active" : ""}
        onClick={() => setActiveTab("create")}
      >
        Create Pass
      </button>

      {/* Fee Details */}
      <button
        disabled={!hasPass}
        className={activeTab === "fee" ? "active" : ""}
        onClick={() => setActiveTab("fee")}
      >
        Fee Details
      </button>

      {/* Add Payment */}
      <button
        disabled={!hasPass}
        className={activeTab === "payment" ? "active" : ""}
        onClick={() => setActiveTab("payment")}
      >
        Add Payment
      </button>

      {/* Approval */}
      <button
        disabled={!hasPass}
        className={activeTab === "approval" ? "active" : ""}
        onClick={() => setActiveTab("approval")}
      >
        Approval
      </button>

      {/* Divider for Special Section */}
      <div className="spm-sidebar-divider"></div>

      {/* Pending Approvals (Fee Paid) */}
      <button
        className={
          activeTab === "pending" ? "active pending-btn" : "pending-btn"
        }
        onClick={() => setActiveTab("pending")}
      >
        Pending Approvals (Fee Paid)
      </button>
    </div>
  );
}

export default StudentPassSidebar;
