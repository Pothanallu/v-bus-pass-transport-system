import React, { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "../components/FSidebar";
import Topbar from "../components/FTopbar";

import "../styles/finance.css";

import {
  MdDashboard,
  MdAttachMoney,
  MdMoneyOff,
  MdTrendingUp,
  MdTrendingDown,
  MdCalendarMonth,
  MdPictureAsPdf,
  MdAccountBalanceWallet,
} from "react-icons/md";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function FinanceManagement() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [summary, setSummary] = useState({});
  const [profit, setProfit] = useState({});
  const [monthly, setMonthly] = useState([]);

  const [revenue, setRevenue] = useState([]);
  const [fuel, setFuel] = useState([]);
  const [service, setService] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  const API = "http://localhost/transport_api/finance";

  /* ===============================
     DATA LOADERS
  =============================== */

  const loadSummary = async () => {
    const res = await axios.get(`${API}/finance_summary.php`);
    setSummary(res.data);
  };

  const loadRevenue = async () => {
    const res = await axios.get(`${API}/revenue_reports.php`);
    setRevenue(res.data);
  };

  const loadProfit = async () => {
    const res = await axios.get(`${API}/profit_loss.php`);
    setProfit(res.data);
  };

  const loadMonthly = async () => {
    const res = await axios.get(`${API}/monthly_report.php`);
    setMonthly(res.data);
  };

  const loadFuel = async () => {
    const res = await axios.get(`${API}/fuel_expenses.php`);
    setFuel(res.data);
  };

  const loadService = async () => {
    const res = await axios.get(`${API}/service_expenses.php`);
    setService(res.data);
  };

  const loadMaintenance = async () => {
    const res = await axios.get(`${API}/maintenance_expenses.php`);
    setMaintenance(res.data);
  };

  /* ===============================
     TAB SWITCH
  =============================== */

  useEffect(() => {
    if (activeTab === "dashboard") {
      loadSummary();
    }

    if (activeTab === "revenue") {
      loadSummary();
      loadRevenue();
    }

    if (activeTab === "expenses") {
      loadFuel();
      loadService();
      loadMaintenance();
    }

    if (activeTab === "profit") {
      loadProfit();
    }

    if (activeTab === "monthly") {
      loadMonthly();
    }
  }, [activeTab]);

  /* ===============================
     EXPORT EXPENSE PDF
  =============================== */

  const exportExpensePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Transport Finance - Expense Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.text("Fuel Expenses", 14, 45);

    autoTable(doc, {
      startY: 50,
      head: [["Date", "Liters", "Cost"]],
      body: fuel.map((f) => [
        f.fuel_date,
        f.liters,
        `₹ ${Number(f.cost).toLocaleString()}`,
      ]),
    });

    doc.text("Service Expenses", 14, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Service Type", "Date", "Cost"]],
      body: service.map((s) => [
        s.service_type,
        s.service_date,
        `₹ ${Number(s.cost).toLocaleString()}`,
      ]),
    });

    doc.text("Maintenance Expenses", 14, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Description", "Date", "Amount"]],
      body: maintenance.map((m) => [
        m.description,
        m.expense_date,
        `₹ ${Number(m.amount).toLocaleString()}`,
      ]),
    });

    doc.save("Expense_Report.pdf");
  };

  return (
    <div className="finance-page">
      <Topbar />

      <div className="page-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* UPDATED CONTENT DIV */}

        <div
          className={`content ${activeTab === "dashboard" ? "dashboard-view" : ""}`}
        >
          {/* ================= DASHBOARD ================= */}

          {activeTab === "dashboard" && (
            <div>
              <h2>
                <MdDashboard /> Dashboard
              </h2>

              <div className="card">
                <h3>Welcome to Finance Management</h3>
                <p>
                  Track revenue, expenses and financial performance of transport
                  system.
                </p>
              </div>

              <div className="stats">
                <div className="stat-box">
                  <MdAttachMoney className="card-icon revenue" />
                  <h4>Total Revenue</h4>
                  <p>₹ {summary?.total_revenue || 0}</p>
                </div>

                <div className="stat-box">
                  <MdMoneyOff className="card-icon expense" />
                  <h4>Total Expenses</h4>
                  <p>₹ {summary?.total_expenses || 0}</p>
                </div>

                <div className="stat-box">
                  <MdAccountBalanceWallet className="card-icon balance" />
                  <h4>Net Balance</h4>
                  <p>₹ {summary?.net_balance || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* ================= REVENUE ================= */}

          {activeTab === "revenue" && (
            <div>
              <h2>
                <MdAttachMoney /> Revenue Reports
              </h2>

              <div className="stats">
                <div className="stat-box">
                  <MdAttachMoney className="card-icon revenue" />
                  <h4>Total Revenue</h4>
                  <p>₹ {summary?.total_revenue || 0}</p>
                </div>
              </div>

              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Receipt No</th>
                    <th>Reg No</th>
                    <th>Amount</th>
                    <th>Payment Date</th>
                  </tr>
                </thead>

                <tbody>
                  {revenue.map((r, i) => (
                    <tr key={i}>
                      <td>{r.receipt_no}</td>
                      <td>{r.reg_no}</td>
                      <td>₹ {r.amount}</td>
                      <td>{r.payment_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= EXPENSES ================= */}

          {activeTab === "expenses" && (
            <div>
              <h2>
                <MdMoneyOff /> Expense Reports
              </h2>

              <button className="export-btn" onClick={exportExpensePDF}>
                <MdPictureAsPdf /> Export Expense Report
              </button>

              <h3>Fuel Expenses</h3>

              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Liters</th>
                    <th>Cost</th>
                  </tr>
                </thead>

                <tbody>
                  {fuel.map((f, i) => (
                    <tr key={i}>
                      <td>{f.fuel_date}</td>
                      <td>{f.liters}</td>
                      <td>₹ {f.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Service Expenses</h3>

              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Service Type</th>
                    <th>Date</th>
                    <th>Cost</th>
                  </tr>
                </thead>

                <tbody>
                  {service.map((s, i) => (
                    <tr key={i}>
                      <td>{s.service_type}</td>
                      <td>{s.service_date}</td>
                      <td>₹ {s.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Maintenance Expenses</h3>

              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {maintenance.map((m, i) => (
                    <tr key={i}>
                      <td>{m.description}</td>
                      <td>{m.expense_date}</td>
                      <td>₹ {m.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= PROFIT / LOSS ================= */}

          {activeTab === "profit" && (
            <div>
              <h2>
                <MdTrendingUp /> Profit / Loss
              </h2>

              <div className="stats">
                <div className="stat-box">
                  <MdAttachMoney className="card-icon revenue" />
                  <h4>Total Revenue</h4>
                  <p>₹ {profit?.total_revenue || 0}</p>
                </div>

                <div className="stat-box">
                  <MdMoneyOff className="card-icon expense" />
                  <h4>Total Expenses</h4>
                  <p>₹ {profit?.total_expenses || 0}</p>
                </div>

                <div className="stat-box">
                  <MdTrendingUp className="card-icon profit" />
                  <h4>Profit</h4>
                  <p style={{ color: "green" }}>₹ {profit?.profit || 0}</p>
                </div>

                <div className="stat-box">
                  <MdTrendingDown className="card-icon loss" />
                  <h4>Loss</h4>
                  <p style={{ color: "red" }}>₹ {profit?.loss || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* ================= MONTHLY REPORT ================= */}

          {activeTab === "monthly" && (
            <div>
              <h2>
                <MdCalendarMonth /> Monthly Report
              </h2>

              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Revenue</th>
                    <th>Expenses</th>
                    <th>Profit</th>
                    <th>Loss</th>
                  </tr>
                </thead>

                <tbody>
                  {monthly.map((m, i) => (
                    <tr key={i}>
                      <td>{m.month}</td>
                      <td>₹ {m.revenue}</td>
                      <td>₹ {m.expenses}</td>
                      <td style={{ color: "green", fontWeight: "bold" }}>
                        ₹ {m.profit}
                      </td>
                      <td style={{ color: "red", fontWeight: "bold" }}>
                        ₹ {m.loss}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinanceManagement;
