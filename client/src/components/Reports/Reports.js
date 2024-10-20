import React, { useState } from 'react';
import './Reports.css';

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reportType: '',
    startDate: '',
    endDate: '',
    comments: '',
  });

  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formData); // saving submitted data
  };

  return (
    <div className="app">

      <main className="container">
        <h2>Request a Report</h2>
        <p>Please fill out the form below to request a report. You will receive the requested report via email.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reportType">Select Report Type</label>
            <select
              id="reportType"
              name="reportType"
              value={formData.reportType}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Report Type --</option>
              <option value="delivery-status">Delivery Status Report</option>
              <option value="package-tracking">Package Tracking Report</option>
              <option value="financial-transactions">Financial Transactions Report</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="comments">Additional Comments</label>
            <textarea
              id="comments"
              name="comments"
              rows="4"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Enter any specific requests or comments..."
            ></textarea>
          </div>

          <div className="form-group">
            <button type="submit">Submit Request</button>
          </div>
        </form>

        {submittedData && (
          <div className="output">
            <h3>Report Request Summary</h3>
            <p><strong>Name:</strong> {submittedData.name}</p>
            <p><strong>Email:</strong> {submittedData.email}</p>
            <p><strong>Report Type:</strong> {submittedData.reportType}</p>
            <p><strong>Date Range:</strong> From {submittedData.startDate} to {submittedData.endDate}</p>
            <p><strong>Comments:</strong> {submittedData.comments ? submittedData.comments : "No additional comments provided."}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
