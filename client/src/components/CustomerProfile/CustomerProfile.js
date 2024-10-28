import React, { useState, useEffect } from "react";
import "./CustomerProfile.css";

const CustomerProfile = () => {
    const [customerInfo, setCustomerInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // Fetch customer data based on the email from localStorage
    useEffect(() => {
        console.log("CustomerProfile mounted");
        const fetchCustomerData = async () => {
            const email = localStorage.getItem("customerEmail");
            if (!email) {
                alert("Account not found, Please log in again.");
                window.location.replace("/login");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://localhost:3001/api/customer?email=${email}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Customer not found.");
                    }
                    throw new Error("Failed to fetch customer data. Please try again later.");
                }
                const data = await response.json();
                setCustomerInfo(data);
            } catch (err) {
                setError(err.message);
                setCustomerInfo(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, []);

    const handleEdit = () => setEditMode(true);

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/api/customer', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerInfo),
            });

            if (!response.ok) {
                throw new Error("Failed to update customer data. Please try again later.");
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
        setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) return <p>Loading customer data...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="customer-profile-container">
            <h1>Customer Profile</h1>
            {customerInfo && (
                <div className="customer-info">
                    {!editMode ? (
                        <div>
                            <p><strong>Name:</strong> {`${customerInfo.Customer_First_Name} ${customerInfo.Customer_Middle_Name || ''} ${customerInfo.Customer_Last_Name}`}</p>
                            <p><strong>Phone Number:</strong> {customerInfo.Customer_Phone_Number}</p>
                            <p><strong>Email:</strong> {customerInfo.Customer_Email_Address}</p>
                            <p><strong>Address:</strong> {`${customerInfo.Customer_Address_House_Number} ${customerInfo.Customer_Address_Street} ${customerInfo.Customer_Address_Suffix || ''}, ${customerInfo.Customer_Address_City}, ${customerInfo.Customer_Address_State} ${customerInfo.Customer_Address_Zip_Code}, ${customerInfo.Customer_Address_Country}`}</p>
                            <p><strong>Balance:</strong> ${customerInfo.Customer_Balance}</p>
                            <button onClick={handleEdit}>Edit</button>
                        </div>
                    ) : (
                        <form>
                            <input
                                type="text"
                                name="Customer_First_Name"
                                value={customerInfo.Customer_First_Name}
                                onChange={handleChange}
                                placeholder="First Name"
                            />
                            <input
                                type="text"
                                name="Customer_Middle_Name"
                                value={customerInfo.Customer_Middle_Name}
                                onChange={handleChange}
                                placeholder="Middle Name"
                            />
                            <input
                                type="text"
                                name="Customer_Last_Name"
                                value={customerInfo.Customer_Last_Name}
                                onChange={handleChange}
                                placeholder="Last Name"
                            />
                            <input
                                type="text"
                                name="Customer_Phone_Number"
                                value={customerInfo.Customer_Phone_Number}
                                onChange={handleChange}
                                placeholder="Phone Number"
                            />
                            <input
                                type="email"
                                name="Customer_Email_Address"
                                value={customerInfo.Customer_Email_Address}
                                onChange={handleChange}
                                placeholder="Email"
                            />
                            <input
                                type="text"
                                name="Customer_Address_House_Number"
                                value={customerInfo.Customer_Address_House_Number}
                                onChange={handleChange}
                                placeholder="House Number"
                            />
                            <input
                                type="text"
                                name="Customer_Address_Street"
                                value={customerInfo.Customer_Address_Street}
                                onChange={handleChange}
                                placeholder="Street"
                            />
                            <input
                                type="text"
                                name="Customer_Address_Suffix"
                                value={customerInfo.Customer_Address_Suffix}
                                onChange={handleChange}
                                placeholder="Suffix"
                            />
                            <input
                                type="text"
                                name="Customer_Address_City"
                                value={customerInfo.Customer_Address_City}
                                onChange={handleChange}
                                placeholder="City"
                            />
                            <input
                                type="text"
                                name="Customer_Address_State"
                                value={customerInfo.Customer_Address_State}
                                onChange={handleChange}
                                placeholder="State/Province"
                            />
                            <input
                                type="text"
                                name="Customer_Address_Zip_Code"
                                value={customerInfo.Customer_Address_Zip_Code}
                                onChange={handleChange}
                                placeholder="Zip Code"
                            />
                            <input
                                type="text"
                                name="Customer_Address_Country"
                                value={customerInfo.Customer_Address_Country}
                                onChange={handleChange}
                                placeholder="Country"
                            />
                            <button type="button" onClick={handleSave}>Save</button>
                            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomerProfile;
