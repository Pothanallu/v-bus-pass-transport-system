import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/DigitalBusPass.css";

function DigitalBusPass() {
  const { passId } = useParams();

  const [pass, setPass] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      `http://localhost/transport_api/student/get_digital_pass.php?pass_id=${passId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPass(data.data);
        else setError(data.message);
      })
      .catch(() => setError("Failed to load digital pass"));
  }, [passId]);

  if (error) return <p className="error">{error}</p>;
  if (!pass) return <p>Loading digital bus pass...</p>;

  const photoUrl = pass.photo
    ? `http://localhost/transport_api/uploads/studentsimages/${pass.photo}`
    : "http://localhost/transport_api/uploads/studentsimages/default.jpg";

  return (
    <div className="pass-container">
      <div className="pass-card">
        {/* HEADER */}
        <div className="pass-header">
          <h2>Vignan's Foundation for Science, Technology & Research</h2>
          <p className="pass-title">Transport Department – Digital Bus Pass</p>
        </div>

        {/* BODY */}
        <div className="pass-body">
          {/* LEFT: STUDENT DETAILS */}
          <div className="pass-details">
            <p>
              <strong>Name:</strong> {pass.name}
            </p>
            <p>
              <strong>Registration No:</strong> {pass.reg_no}
            </p>
            <p>
              <strong>Department:</strong> {pass.department}
            </p>
            <p>
              <strong>Year / Section:</strong> {pass.year} / {pass.section}
            </p>
            <p>
              <strong>Route (City):</strong> {pass.city}
            </p>
            <p>
              <strong>Bus No:</strong> {pass.bus_no}
            </p>
            <p>
              <strong>Boarding Point:</strong> {pass.boarding_point}
            </p>
            <p>
              <strong>Pass ID:</strong> {pass.pass_id}
            </p>
          </div>

          {/* RIGHT: PHOTO + QR */}
          <div className="qr-section">
            {/* LEFT: Photo */}
            <img src={photoUrl} alt="Student" className="pass-photo" />

            {/* RIGHT: QR */}
            <div className="qr-wrapper">
              <QRCodeCanvas
                value={`PASS_ID:${pass.pass_id}|REG_NO:${pass.reg_no}`}
                size={120}
              />
              <p className="qr-text">Scan for verification</p>
            </div>
          </div>
        </div>

        {/* FOOTER – TRANSPORT AUTH */}
        <div className="pass-footer">
          <p className="stamp-text">
            Vignan University – Transport Management System
          </p>
          <p className="signature-text">
            Digitally Authorized
            <br />
            Transport Officer
          </p>
        </div>

        {/* PRINT BUTTON */}
        <div className="spm-center">
          <button className="print-btn" onClick={() => window.print()}>
            Print / Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default DigitalBusPass;
