import React, { useState } from 'react';
import './Reports.css';

import { SERVER_URL } from "../../App";

const Reports = () => {
    const [formData, setFormData] = useState({
        reportType: '',
        startDate: '',
        endDate: '',
        departmentName : '',
        productType:'',
    });
    const [data, setData] = useState([]);
    const [customerSuggestions, setCustomerSuggestions] = useState([]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (name === 'customerName' && value.length > 0) {
            fetchCustomerSuggestions(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { reportType, startDate, endDate, departmentName, productType } = formData;
        const url = new URL(`http://localhost:3001/api/reports/${reportType}`);

        // Only append startDate and endDate if the report type is financial-transactions
        if (reportType === 'employee-department') {
            if (departmentName) url.searchParams.append("departmentName", departmentName);
        }
        else if (reportType === 'financial-transactions') {
            if (startDate) url.searchParams.append("startDate", startDate);
            if (endDate) url.searchParams.append("endDate", endDate);
            if (productType) url.searchParams.append("productType", productType);
        } 
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();
            const formattedData = formatData(result, reportType);
            setData(formattedData);
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };
/////////////
    const fetchCustomerSuggestions = async (query) => {
        try {
            const response = await fetch(`http://localhost:3001/api/customers?search=${query}`);
            const result = await response.json();
            setCustomerSuggestions(result);
        } catch (error) {
            console.error('Error fetching customer suggestions:', error);
        }
    };

    const handleCustomerSelect = (customerName) => {
        setFormData({
            ...formData,
            customerName
        });
        setCustomerSuggestions([]); // Clear suggestions after selection
    };
//////////////
    const formatData = (result, reportType) => {
        if (reportType === 'employee-department') {
            return result.map((item) => ({
                id: item.Employee_ID,
                name: `${item.First_Name} ${item.Middle_Name || ''} ${item.Last_Name}`,
                 department: item.Employee_Department_ID,
                department_name: item.Department_Name, 
            }));
        } else if (reportType === 'package-delivery') {
            return result.map((item) => ({
                package_id: item.Package_ID,
                sender_id: item.Sender_ID,
                recipient_id: item.Recipient_ID,
                address: `
                ${item.Package_House_Number} 
                ${item.Package_Street} 
                ${item.Package_Suffix}, 
                ${item.Package_City}`.trim(),
            }));
        } else if (reportType === 'financial-transactions') {
            return result.map((item) => ({
                transaction_id: item.Transaction_ID,
                amount: item.Amount_Deducted,
                date: item.Transaction_Date,
                category: item.Product_Name,
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
                            <th>Name</th>
                            <th>Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.department_name}</td>
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
                            <th>Package Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.package_id}>
                                <td>{item.address}</td>
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
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.transaction_id}>
                                <td>{item.amount}</td>
                                <td>{new Date(item.date).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}</td>
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
                    {/* Department selection for employee-department reports */}
                    {formData.reportType === 'employee-department' && (
                        <div className="form-group">
                            <label htmlFor="departmentName">Department</label>
                            <select
                                name="departmentName"
                                id="departmentName"
                                value={formData.departmentName} 
                                onChange={handleChange} 
                            >
                                <option value="">-- Select Department --</option>
                                <option value="Distribution">Distribution</option>
                                <option value="Finance">Finance</option>
                                <option value="Human Resources">Human Resources</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Legal">Legal</option>
                                <option value="Transportation">Transportation</option>
                            </select>
                        </div>
                    )}
                    {/* date filtering for financial transaction reports */}
                    {formData.reportType === 'financial-transactions' && (
                        <>
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
                                <label htmlFor="productType">Product Type</label>
                                <select
                                    id="productType"
                                    name="productType"
                                    value={formData.productType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select a product type</option>
                                    <option value="stamps">Stamps</option>
                                    <option value="envelopes">Envelopes</option>
                                    <option value="small package">Small Package</option>
                                    <option value="medium package">Medium Package</option>
                                    <option value="large package">Large Package</option>
                                    {/* Add more product types as needed */}
                                </select>
                </div>

                <div className="form-group">
                    <label htmlFor="customerName">Customer Name</label>
                    <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Search by customer name"
                    />
                    {customerSuggestions.length > 0 && (
                        <ul className="dropdown">
                            {customerSuggestions.map((customer) => (
                                <li
                                    key={customer.Customer_ID}
                                    onClick={() => handleCustomerSelect(customer.Name)}
                                >
                                    {customer.Name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                        </>
                    )}

          <div className="form-group">
            <button type="submit">Submit Request</button>
          </div>
        </form>

                {data.length > 0 && (
                    <div>
                        <h3>Report Results:</h3>
                        {renderTable()}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Reports;
