import "../styles/StudentPassManagement.css";

function StudentDetails({ student }) {
  const photoUrl = student.photo
    ? `http://localhost/transport_api/uploads/studentsimages/${student.photo}`
    : "http://localhost/transport_api/uploads/studentsimages/default.jpg";

  return (
    <>
      {/* Title */}
      <h3 className="spm-student-title">Student Details</h3>

      {/* Content Row */}
      <div className="spm-student-card">
        {/* Left: Student Info */}
        <div className="spm-student-info">
          <p>
            <strong>Reg No:</strong> {student.reg_no}
          </p>
          <p>
            <strong>Name:</strong> {student.name}
          </p>
          <p>
            <strong>Department:</strong> {student.department}
          </p>
          <p>
            <strong>Year / Sem:</strong> {student.year} / {student.semester}
          </p>
          <p>
            <strong>Phone:</strong> {student.phone}
          </p>
        </div>

        {/* Right: Student Photo */}
        <div className="spm-student-photo-wrapper">
          <img
            src={photoUrl}
            alt="Student"
            className="spm-student-photo"
            onError={(e) => {
              e.target.src =
                "http://localhost/transport_api/uploads/students/images/default.jpg";
            }}
          />
        </div>
      </div>
    </>
  );
}

export default StudentDetails;
