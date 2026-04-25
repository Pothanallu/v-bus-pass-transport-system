function BusInsuranceDetails({ insurance }) {
  return (
    <div className="card">
      <h4>Insurance Details</h4>

      <p>
        <b>Company:</b> {insurance.insurance_company}
      </p>
      <p>
        <b>Policy Number:</b> {insurance.policy_number}
      </p>
      <p>
        <b>Valid From:</b> {insurance.start_date}
      </p>
      <p>
        <b>Valid Till:</b> {insurance.expiry_date}
      </p>
    </div>
  );
}

export default BusInsuranceDetails;
