import React, { useEffect, useState } from "react";
import axios from "axios";

/* Components */
import Sidebar from "../components/RASidebar";
import Topbar from "../components/RATopbar";

/* Styles */
import "../styles/reportanalysis.css";

/* Icons */
import {
  MdAnalytics,
  MdPeople,
  MdDirectionsBus,
  MdAttachMoney,
} from "react-icons/md";

/* Charts */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

function ReportsAnalytics() {
  const API = "http://localhost/transport_api/reports";

  const [activeTab, setActiveTab] = useState("dashboard");

  const [summary, setSummary] = useState({});
  const [busUsage, setBusUsage] = useState([]);
  const [boarding, setBoarding] = useState([]);
  const [status, setStatus] = useState([]);
  const [payments, setPayments] = useState([]);
  const [monthly, setMonthly] = useState([]);

  /* LOAD DASHBOARD DATA */

  const loadDashboard = async () => {
    try {
      const res = await axios.get(`${API}/reports_overview.php`);

      console.log(res.data); // 👈 check here

      setSummary(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* LOAD BUS USAGE */

  const loadBusUsage = async () => {
    try {
      const res = await axios.get(`${API}/bus_usage.php`);
      setBusUsage(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* LOAD BOARDING POINTS */

  const loadBoarding = async () => {
    try {
      const res = await axios.get(`${API}/boarding_points.php`);
      setBoarding(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* LOAD PASS STATUS */

  const loadStatus = async () => {
    try {
      const res = await axios.get(`${API}/pass_status.php`);
      setStatus(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadPayments = async () => {
    try {
      const res = await axios.get(`${API}/payment_reports.php`);

      if (Array.isArray(res.data)) {
        setPayments(res.data);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.log(err);
      setPayments([]);
    }
  };

  const loadMonthly = async () => {
    try {
      const res = await axios.get(`${API}/monthly_analytics.php`);

      if (Array.isArray(res.data)) {
        setMonthly(res.data);
      } else {
        setMonthly([]);
      }
    } catch (err) {
      console.log(err);
      setMonthly([]);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadBusUsage();
    loadBoarding();
    loadStatus();
    loadPayments();
    loadMonthly();
  }, []);

  /* BUS CHART */

  const busChart = {
    labels: busUsage.map((b) => b.bus_no),

    datasets: [
      {
        label: "Students",
        data: busUsage.map((b) => b.students),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  /* STATUS PIE CHART */

  const statusChart = {
    labels: status.map((s) => s.status),

    datasets: [
      {
        data: status.map((s) => s.total),
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const monthlyChart = {
    labels: Array.isArray(monthly) ? monthly.map((m) => m.month) : [],

    datasets: [
      {
        label: "Monthly Revenue",
        data: Array.isArray(monthly) ? monthly.map((m) => m.revenue) : [],
        backgroundColor: "#6366f1",
      },
    ],
  };

  return (
    <div className="finance-page">
      <Topbar />

      <div className="page-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="content">
          <h2 className="section-title">
            <MdAnalytics className="title-icon" />
            Reports & Analytics
          </h2>

          {/* DASHBOARD */}

          {activeTab === "dashboard" && (
            <>
              <div className="card">
                <h3>Transport Analytics Dashboard</h3>

                <p>
                  View transport statistics and operational insights including
                  student usage, revenue performance and transport operations.
                </p>
              </div>

              {/* STATS */}

              <div className="stats">
                <div className="stat-box">
                  <MdPeople className="card-icon revenue" />
                  <h4>Total Students</h4>
                  <p>{summary.students || 0}</p>
                </div>

                <div className="stat-box">
                  <MdDirectionsBus className="card-icon balance" />
                  <h4>Total Buses</h4>
                  <p>{summary.buses || 0}</p>
                </div>

                <div className="stat-box">
                  <MdPeople className="card-icon expense" />
                  <h4>Total Drivers</h4>
                  <p>{summary.drivers || 0}</p>
                </div>

                <div className="stat-box">
                  <MdAttachMoney className="card-icon revenue" />
                  <h4>Total Revenue</h4>
                  <p>₹ {summary.revenue || 0}</p>
                </div>
              </div>

              {/* CHARTS */}

              <div className="charts">
                <div className="chart-card">
                  <h3>Bus Usage Chart</h3>
                  <Bar data={busChart} />
                </div>

                <div className="chart-card">
                  <h3>Pass Status Distribution</h3>
                  <Pie data={statusChart} />
                </div>
              </div>
            </>
          )}

          {/* BUS USAGE */}

          {activeTab === "busUsage" && (
            <div>
              <h3>Bus Usage Report</h3>

              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Bus No</th>
                    <th>City</th>
                    <th>Total Students</th>
                  </tr>
                </thead>

                <tbody>
                  {busUsage.map((bus, index) => (
                    <tr key={index}>
                      <td>{bus.bus_no}</td>
                      <td>{bus.city}</td>
                      <td>{bus.students}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* BOARDING POINT */}

          {activeTab === "boarding" && (
            <div>
              <h3>Boarding Point Analysis</h3>

              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Boarding Point</th>
                    <th>Students</th>
                  </tr>
                </thead>

                <tbody>
                  {boarding.map((b, index) => (
                    <tr key={index}>
                      <td>{b.boarding_point}</td>
                      <td>{b.students}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PASS STATUS */}

          {activeTab === "status" && (
            <div>
              <h3>Pass Status Report</h3>

              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {status.map((s, index) => (
                    <tr key={index}>
                      <td>{s.status}</td>
                      <td>{s.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAYMENT REPORT */}

          {activeTab === "payments" && (
            <div>
              <h3>Payment Reports</h3>

              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Receipt No</th>
                    <th>Student</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.length > 0 ? (
                    payments.map((p, index) => (
                      <tr key={index}>
                        <td>{p.receipt_no}</td>
                        <td>{p.reg_no}</td>
                        <td>₹ {p.amount}</td>
                        <td>{p.payment_date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No payment records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* MONTHLY ANALYTICS */}

          {activeTab === "monthly" && (
            <div>
              <h3>Monthly Revenue Analytics</h3>

              <div className="chart-card">
                <Bar data={monthlyChart} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportsAnalytics;
