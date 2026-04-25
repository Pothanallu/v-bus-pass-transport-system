import { useState, useEffect, useCallback } from "react";

/* Components */
import StudentSearch from "../components/StudentSearch";
import StudentDetails from "../components/StudentDetails";
import BusPassForm from "../components/BusPassForm";
import BusPassDetails from "../components/BusPassDetails";
import FeeSummary from "../components/FeeSummary";
import PaymentHistory from "../components/PaymentHistory";
import AddPaymentForm from "../components/AddPaymentForm";
import ApproveRejectActions from "../components/ApproveRejectActions";
import StudentPassTopbar from "../components/StudentPassTopbar";
import StudentPassSidebar from "../components/StudentPassSidebar";
import PendingApprovals from "../components/PendingApprovals";

/* Styles */
import "../styles/StudentPassManagement.css";

function StudentPassManagement() {
  const [activeTab, setActiveTab] = useState("welcome");
  const [student, setStudent] = useState(null);
  const [busPass, setBusPass] = useState(null);
  const [feeSummary, setFeeSummary] = useState(null);
  const [autoSearchRegNo, setAutoSearchRegNo] = useState(null);

  /* =========================
     AFTER STUDENT SEARCH
  ========================= */
  const handleStudentFound = (studentData, passData) => {
    setStudent(studentData);
    setBusPass(passData || null);
    setFeeSummary(null);
    setActiveTab("student");
    setAutoSearchRegNo(null); // 🔒 stop re-trigger
  };

  /* =========================
     REFRESH PASS + FEE (FIXED)
  ========================= */
  const refreshPassData = useCallback(async (regNo) => {
    try {
      // 1️⃣ Fee summary
      const feeRes = await fetch(
        "http://localhost/transport_api/student/get_fee_summary.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reg_no: regNo }),
        },
      );
      const feeData = await feeRes.json();

      if (feeData.success) {
        setFeeSummary(feeData.data);

        // ✅ UPDATE STATUS ONLY IF PASS EXISTS
        setBusPass((prev) => {
          if (!prev) return prev;
          return { ...prev, status: feeData.data.status };
        });
      }

      // 2️⃣ Full bus pass
      const passRes = await fetch(
        `http://localhost/transport_api/student/get_bus_pass.php?reg_no=${regNo}`,
      );
      const passData = await passRes.json();

      if (passData.success) {
        setBusPass((prev) => ({
          ...prev,
          ...passData.data,
        }));
      }
    } catch (err) {
      console.error("Refresh failed", err);
    }
  }, []);

  /* =========================
     LOAD DATA WHEN TAB CHANGES
  ========================= */
  useEffect(() => {
    if (student && ["fee", "payment", "approval"].includes(activeTab)) {
      refreshPassData(student.reg_no);
    }
  }, [activeTab, student, refreshPassData]);

  return (
    <div className="spm-root">
      {/* 🔒 HEADER NEVER DISAPPEARS */}
      <StudentPassTopbar
        student={student}
        busPass={busPass}
        feeSummary={feeSummary}
      />

      <div className="spm-body">
        <StudentPassSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasStudent={!!student}
          hasPass={!!busPass}
        />

        <div className="spm-content">
          {/* SEARCH */}
          <div className="spm-section">
            <StudentSearch
              onStudentFound={handleStudentFound}
              autoSearchRegNo={autoSearchRegNo}
            />
          </div>

          {/* WELCOME */}
          {activeTab === "welcome" && (
            <div className="spm-welcome card">
              <h3>Welcome to Student Bus Pass Management</h3>
              <p>
                Manage student transport records, bus passes, payments,
                approvals, and digital passes.
              </p>
              <ul>
                <li>🔍 Search student by Registration Number</li>
                <li>🚌 Create and manage bus passes</li>
                <li>💰 Track and collect fee payments</li>
                <li>✅ Approve or reject bus passes</li>
              </ul>
            </div>
          )}

          {/* STUDENT DETAILS */}
          {activeTab === "student" && student && (
            <StudentDetails student={student} />
          )}

          {/* CREATE PASS */}
          {activeTab === "create" && student && !busPass && (
            <BusPassForm
              student={student}
              onCreated={() => {
                setAutoSearchRegNo(student.reg_no); // 🔥 auto re-search
              }}
            />
          )}

          {/* PASS DETAILS (AFTER CREATION) */}
          {activeTab === "create" && busPass && (
            <BusPassDetails busPass={busPass} />
          )}

          {/* FEE DETAILS + PAYMENT HISTORY */}
          {activeTab === "fee" && feeSummary && (
            <>
              <FeeSummary data={feeSummary} />
              <PaymentHistory payments={feeSummary.payments} />
            </>
          )}

          {/* PAYMENT */}
          {activeTab === "payment" &&
            feeSummary &&
            (busPass?.status === "Approved" ? (
              <div className="locked-card card">
                <h4>Payments Locked</h4>
                <p>This bus pass has already been approved.</p>
              </div>
            ) : feeSummary.balance === 0 ? (
              <div className="locked-card card">
                <h4>Fee Fully Paid</h4>
                <p>No further payments are required.</p>
              </div>
            ) : (
              <AddPaymentForm
                passId={feeSummary.pass_id}
                onSuccess={() => refreshPassData(student.reg_no)}
              />
            ))}

          {/* APPROVAL */}
          {activeTab === "approval" && feeSummary && (
            <>
              {/* 1️⃣ PAYMENT NOT COMPLETED */}
              {feeSummary.payment_status !== "Fully Paid" ? (
                <div className="locked-card card">
                  <h4>Approval Locked</h4>
                  <p>Please complete the full payment before approval.</p>
                </div>
              ) : /* 2️⃣ PAYMENT COMPLETED BUT NOT APPROVED */
              busPass?.status !== "Approved" ? (
                <ApproveRejectActions
                  passId={feeSummary.pass_id}
                  paymentStatus={feeSummary.payment_status}
                  onUpdate={() => refreshPassData(student.reg_no)}
                />
              ) : (
                /* 3️⃣ ALREADY APPROVED */
                <div className="locked-card card spm-center">
                  <h4>Bus Pass Approved</h4>
                  <p>Your bus pass is active and ready for use.</p>
                  <p className="info-text">
                    You can view, download, or print the digital bus pass using
                    the button below.
                  </p>

                  <button
                    className="digital-pass-btn"
                    onClick={() =>
                      window.open(
                        `/digital-pass/${feeSummary.pass_id}`,
                        "_blank",
                      )
                    }
                  >
                    View Digital Bus Pass
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "pending" && (
            <PendingApprovals
              setActiveTab={setActiveTab}
              setAutoSearchRegNo={setAutoSearchRegNo} // ✅ REQUIRED
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentPassManagement;
