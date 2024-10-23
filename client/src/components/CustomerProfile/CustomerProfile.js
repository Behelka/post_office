//doesn't work yet
import React, { useState, useEffect } from "react";
import "./CustomerProfile.css";

function CustomerProfile() {
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        // Fetch customer data from backend
        const fetchCustomerData = async () => {
            try {
                const response = await fetch('/api/customer');  // Change this route as needed
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                setCustomer(result); // Assuming a single customer is returned
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }
        };

        fetchCustomerData();
    }, []);

    if (!customer) {
        return <div>Loading...</div>;
    }

    return (
        <div className="customer-profile-container">
            <h1>Customer Profile</h1>
            <div className="customer-profile">
                <div><strong>First Name:</strong> {customer.Customer_First_Name}</div>
                <div><strong>Middle Name:</strong> {customer.Customer_Middle_Name || 'N/A'}</div>
                <div><strong>Last Name:</strong> {customer.Customer_Last_Name}</div>
                <div><strong>Email:</strong> {customer.Customer_Email_Address}</div>
                <div><strong>Phone Number:</strong> {customer.Customer_Phone_Number}</div>
                <div><strong>Address:</strong> {`${customer.Customer_Address_House_Number} ${customer.Customer_Address_Street} ${customer.Customer_Address_Suffix}, ${customer.Customer_Address_City}, ${customer.Customer_Address_State} ${customer.Customer_Address_Zip_Code}, ${customer.Customer_Address_Country}`}</div>
                <div><strong>Balance:</strong> ${customer.Customer_Balance}</div>
            </div>
        </div>
    );
}

export default CustomerProfile;
