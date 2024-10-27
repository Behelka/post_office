import React, { useState } from "react";
import "./EmployeeProfile.css";

const EmployeeProfile = () => {
    const [customerID, setCustomerID] = useState(''); // 输入框中的客户ID
    const [customerInfo, setCustomerInfo] = useState(null); // 客户数据
    const [loading, setLoading] = useState(false); // 加载状态
    const [error, setError] = useState(null); // 错误状态
    const [editMode, setEditMode] = useState(false); // 编辑模式

    // 获取客户数据的函数
    const fetchCustomerData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3001/api/customer?customerId=${customerID}`);
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

    // 提交客户ID的处理函数
    const handleSubmit = (e) => {
        e.preventDefault();
        if (customerID) {
            fetchCustomerData();
        }
    };

    // 编辑客户信息
    const handleEdit = () => {
        setEditMode(true);
    };

    // 保存编辑后的客户信息
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

    // 更新客户信息状态
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo({ ...customerInfo, [name]: value });
    };

    return (
        <div className="employee-profile-container">
            <h1>Employee Profile</h1>

            {/* 输入客户ID的表单 */}
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="text"
                    value={customerID}
                    onChange={(e) => setCustomerID(e.target.value)}
                    placeholder="Enter Customer ID"
                    required
                />
                <button type="submit">Search</button>
            </form>

            {/* 显示加载、错误或客户数据 */}
            {loading && <p>Loading...</p >}
            {error && <p style={{ color: 'red' }}>{error}</p >}
            {customerInfo && (
                <div className="customer-info">
                    <h2>Customer Information</h2>
                    {!editMode ? (
                        <div>
                            <p><strong>ID:</strong> {customerInfo.Customer_ID}</p >
                            <p><strong>Name:</strong> {`${customerInfo.Customer_First_Name} ${customerInfo.Customer_Middle_Name || ''} ${customerInfo.Customer_Last_Name}`}</p >
                            <p><strong>Phone Number:</strong> {customerInfo.Customer_Phone_Number}</p >
                            <p><strong>Email:</strong> {customerInfo.Customer_Email_Address}</p >
                            <p><strong>Address:</strong> {`${customerInfo.Customer_Address_House_Number} ${customerInfo.Customer_Address_Street} ${customerInfo.Customer_Address_Suffix || ''}, ${customerInfo.Customer_Address_City}, ${customerInfo.Customer_Address_State} ${customerInfo.Customer_Address_Zip_Code}, ${customerInfo.Customer_Address_Country}`}</p >
                            <p><strong>Balance:</strong> ${customerInfo.Customer_Balance}</p >
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
                                placeholder="State"
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
                            {/* 其他字段的输入框 */}
                            <button type="button" onClick={handleSave}>Save</button>
                            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmployeeProfile;