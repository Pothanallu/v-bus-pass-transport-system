function BusInspectionDetails({ inspection }) {
  return (
    <div className="card">
      <h4>Inspection & Fitness</h4>

      <p>
        <b>Condition:</b> {inspection.condition_status}
      </p>
      <p>
        <b>Fitness Expiry:</b> {inspection.fitness_expiry_date}
      </p>
      <p>
        <b>Remarks:</b> {inspection.remarks}
      </p>
    </div>
  );
}

export default BusInspectionDetails;
