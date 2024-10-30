import React, { useState } from "react";
import "./EmployeeProfile.css";

import { SERVER_URL } from "../../App";

const EmployeeProfile = () => {
    const [customerID, setCustomerID] = useState(''); 
    const [customerInfo, setCustomerInfo] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 
    const [editMode, setEditMode] = useState(false);

 
    const fetchCustomerData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${SERVER_URL}/api/customer?customerId=${customerID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch customer data');
            }
            const data = await response.json();
            if (data.message === 'Customer not found') {
                setError('Customer ID not found');
                setCustomerInfo(null);
            } else {
                setCustomerInfo(data);
            }
        } catch (err) {
            setError(err.message);
            setCustomerInfo(null);
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (customerID) {
            fetchCustomerData();
            setCustomerID('');
            setEditMode(false)
        }
    };


    const handleEdit = () => {
        setEditMode(true);
    };


    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${SERVER_URL}/api/customer`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerInfo),
            });

            if (!response.ok) {
                throw new Error('Failed to update customer data');
            }

            const result = await response.json();
            alert(result.message);
            setEditMode(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo({ ...customerInfo, [name]: value });
    };

    return (
        <div className="ep_main_div">
            <h1 className="h">Customer Search</h1>


            <form onSubmit={handleSubmit} className="search-form">

                <input
                    className="input"
                    type="number"
                    value={customerID}
                    onChange={(e) => setCustomerID(e.target.value)}
                    placeholder="Enter Customer ID"
                    required
                />
                <button type="submit" className="ep_searchButton">Search</button>
            </form>


            {loading && <p>Loading...</p >}
            {error && <p className="error-message">{error}</p >}
            {customerInfo && (
                <div className="customer-info">
                    <h1 className="h">Customer Information</h1>
                    {!editMode ? (
                        <div>
                            <p className="Information"><strong>Customer ID:</strong> {customerInfo.Customer_ID}</p >
                            <p className="Information"><strong>Customer Name:</strong> {`${customerInfo.Customer_First_Name} ${customerInfo.Customer_Middle_Name || ''} ${customerInfo.Customer_Last_Name}`}</p >
                            <p className="Information"><strong>Phone Number:</strong> {customerInfo.Customer_Phone_Number}</p >
                            <p className="Information"><strong>Email:</strong> {customerInfo.Customer_Email_Address}</p >
                            <p className="Information"><strong>Address:</strong> {`${customerInfo.Customer_Address_House_Number} ${customerInfo.Customer_Address_Street} ${customerInfo.Customer_Address_Suffix || ''}, ${customerInfo.Customer_Address_City}, ${customerInfo.Customer_Address_State} ${customerInfo.Customer_Address_Zip_Code}, ${customerInfo.Customer_Address_Country}`}</p >
                            <p className="Information"><strong>Balance:</strong> ${customerInfo.Customer_Balance}</p >
                            <button onClick={handleEdit} className="updateButton">Edit</button>
                        </div>
                    ) : (
                        <form class="form-container">
                        <table class="form-table">
                            <tr>
                            <td class="label">Customer Name:</td>
                            <td>
                                <input
                                type="text"
                                name="Customer_First_Name"
                                value={customerInfo.Customer_First_Name}
                                onChange={handleChange}
                                placeholder="First Name"
                                />
                            </td>
                            <td>
                                <input
                                type="text"
                                name="Customer_Middle_Name"
                                value={customerInfo.Customer_Middle_Name}
                                onChange={handleChange}
                                placeholder="Middle Name"
                                />
                            </td>
                            <td>
                                <input
                                type="text"
                                name="Customer_Last_Name"
                                value={customerInfo.Customer_Last_Name}
                                onChange={handleChange}
                                placeholder="Last Name"
                                />
                            </td>
                            </tr>

                            <tr>
                            <td class="label">Phone Number:</td>
                            <td colspan="3">
                                <input
                                type="text"
                                name="Customer_Phone_Number"
                                value={customerInfo.Customer_Phone_Number}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                />
                            </td>
                            </tr>

                            <tr>
                            <td class="label">Email:</td>
                            <td colspan="3">
                                <input
                                type="email"
                                name="Customer_Email_Address"
                                value={customerInfo.Customer_Email_Address}
                                onChange={handleChange}
                                placeholder="Email"
                                />
                            </td>
                            </tr>

                            <tr>
                            <td class="label">Address:</td>
                            <td>
                                <input
                                type="text"
                                name="Customer_Address_House_Number"
                                value={customerInfo.Customer_Address_House_Number}
                                onChange={handleChange}
                                placeholder="House Number"
                                />
                            </td>
                            <td>
                                <input
                                type="text"
                                name="Customer_Address_Street"
                                value={customerInfo.Customer_Address_Street}
                                onChange={handleChange}
                                placeholder="Street"
                                />
                            </td>
                            <td>
                                <input
                                type="text"
                                name="Customer_Address_Suffix"
                                value={customerInfo.Customer_Address_Suffix}
                                onChange={handleChange}
                                placeholder="Suffix"
                                />
                            </td>
                            </tr>

                            <tr>
                            <td class="label">City:</td>
                            <td colspan="3">
                                <input
                                type="text"
                                name="Customer_Address_City"
                                value={customerInfo.Customer_Address_City}
                                onChange={handleChange}
                                placeholder="City"
                                />
                            </td>
                            </tr>

                            <tr>
                            <td class="label">State:</td>
                            <td colspan="3">
                                <input
                                type="text"
                                name="Customer_Address_State"
                                value={customerInfo.Customer_Address_State}
                                onChange={handleChange}
                                placeholder="State"
                                />
                            </td>
                            </tr>

                            <tr>
                            <td class="label">Zip Code:</td>
                            <td colspan="3">
                                <input
                                type="text"
                                name="Customer_Address_Zip_Code"
                                value={customerInfo.Customer_Address_Zip_Code}
                                onChange={handleChange}
                                placeholder="Zip Code"
                                />
                            </td>
                            </tr>

                            <tr>
                            <td class="label">Country:</td>
                            <td colspan="3">
                                <input
                                type="text"
                                name="Customer_Address_Country"
                                value={customerInfo.Customer_Address_Country}
                                onChange={handleChange}
                                placeholder="Country"
                                />
                            </td>
                            </tr>

                            <tr>
                            <td colspan="4" class="button-container">
                                <button type="button" onClick={handleSave} class="updateButton">Save</button>
                                <button type="button" onClick={() => setEditMode(false)} class="updateButton">Cancel</button>
                            </td>
                            </tr>
                        </table>
                        </form>

                    )}
                </div>
            )}
        </div>
    );
};

export default EmployeeProfile;