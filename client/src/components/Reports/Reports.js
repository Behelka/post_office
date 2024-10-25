import React, { useState } from 'react';
import './Reports.css';

const Reports = () => {
    const [formData, setFormData] = useState({
        reportType: '',
        comments: '',
    });
    const [data, setData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();

            // Format the data based on report type
            const formattedData = formatData(result, formData.reportType);
            setData(formattedData);
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    // Function to format data based on report type
    const formatData = (result, reportType) => {
        if (reportType === 'employee-department') {
            return result.map((item) => ({
                id: item.id,
                // department: item.department_name,
                employees: item.employee_count,
            }));
        } else if (reportType === 'package-delivery') {
            return result.map((item) => ({
                package_id: item.package_id,
                package: `
                ${item.Package_ID} 
                ${item.Sender_ID} 
                ${item.Recipient_ID || ''}, 
                ${item.Package_House_Number}, 
                ${item.Package_Street} 
                ${item.Package_Suffix}, 
                ${item.Package_City}`.trim(),
            }));
        } else if (reportType === 'financial-transactions') {
            return result.map((item) => ({
                transaction_id: item.transaction_id,
                amount: item.amount,
                date: item.transaction_date,
            }));
        }
        return [];
    };

    const renderTable = () => {
        if (!data || data.length === 0) return <p>No data available.</p>;

        // Decide which table to render based on report type
        if (formData.reportType === 'employee-department') {
            return (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Department</th>
                            <th>Employees</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.department}</td>
                                <td>{item.employees}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (formData.reportType === 'package-delivery') {
            return (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Package ID</th>
                            <th>Package Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.package_id}>
                                <td>{item.package_id}</td>
                                <td>{item.package}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (formData.reportType === 'financial-transactions') {
            return (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.transaction_id}>
                                <td>{item.transaction_id}</td>
                                <td>{item.amount}</td>
                                <td>{new Date(item.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
    };

    return (
        <div className="app">
            <main className="container">
                <h2>Request a Report</h2>
                <form onSubmit={handleSubmit}>
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
                            <option value="employee-department">Employee Department Report</option>
                            <option value="package-delivery">Package Delivery Report</option>
                            <option value="financial-transactions">Financial Transactions Report</option>
                        </select>
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

                {data.length > 0 && (
                    <div>
                        <h3>Report Results:</h3>
                        {renderTable()} {/* Render the report results as a table */}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Reports;
