import React, { useState, useEffect } from "react";
import "./CustomerProfile.css";

const CustomerExample = () => {
    const [customerinfo, setcustomerinfo] = useState([
        { CustomerID: 1, FirstName: "Alex", Midname: "J", Lastname: "Smith", PhoneNumber: "987654321", HouseNumber: "558", Street: "shadow", Suffix: "Blvd", City: "Houston", State: "TX", ZipCode: "77524", Country: "USA", Email: "Smith@gmail.com", Balance: 98 },
        { CustomerID: 2, FirstName: "B", Midname: "J", Lastname: "FF", PhoneNumber: "987654321", HouseNumber: "558", Street: "shadow", Suffix: "Blvd", City: "Houston", State: "TX", ZipCode: "77524", Country: "USA", Email: "Smith@gmail.com", Balance: 98 },
        { CustomerID: 3, FirstName: "C", Midname: "J", Lastname: "GAG", PhoneNumber: "987654321", HouseNumber: "558", Street: "shadow", Suffix: "Blvd", City: "Houston", State: "TX", ZipCode: "77524", Country: "USA", Email: "Smith@gmail.com", Balance: 98 },
    ]);

    const [customerID, setcustomerID] = useState(2);
    const [editInfo, setEditInfo] = useState(false);
    const [mergedCustomer, setmergedCustomer] = useState([]);
    const [editCustomer, setEditCustomer] = useState({});

    useEffect(() => {
        const filtered = customerinfo.find(
            (customer) => customer.CustomerID === customerID
        );

        const merged = filtered ? {
            ID: filtered.CustomerID,
            NAME: `${filtered.FirstName} ${filtered.Midname} ${filtered.Lastname}`.trim(),
            ADDRESS: `${filtered.HouseNumber} ${filtered.Street} ${filtered.Suffix}, 
                      ${filtered.City}, ${filtered.State} ${filtered.ZipCode}, ${filtered.Country}`,
            PHONENUMBER: filtered.PhoneNumber,
            EMAIL: filtered.Email,
            BALANCE: filtered.Balance,
        } : {};

        setmergedCustomer([merged]);
    }, [customerID, customerinfo]);

    const handleEdit = (id) => {
        setEditInfo(true);
        const Info = customerinfo.find((customer) => customer.CustomerID === id);
        if (Info) {
            setcustomerID(Info.CustomerID);
            setEditCustomer(Info);
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const updatedCustomerInfo = customerinfo.map((customer) =>
            customer.CustomerID === customerID ? { ...editCustomer, CustomerID: customerID } : customer
        );
        setcustomerinfo(updatedCustomerInfo);
        setEditInfo(false);
    };

    return (
        <div>
            <h1>Customer Information</h1>
            {mergedCustomer.map((customer, index) => (
                <div key={index}>
                    <p><strong>ID: </strong>{customer.ID}</p>
                    <p><strong>Name: </strong>{customer.NAME}</p>
                    <p><strong>Address: </strong>{customer.ADDRESS}</p>
                    <p><strong>Phone Number: </strong>{customer.PHONENUMBER}</p>
                    <p><strong>Email: </strong>{customer.EMAIL}</p>
                    <p><strong>Balance: </strong>${customer.BALANCE}</p>
                    <p><button onClick={() => handleEdit(customer.ID)}>Edit</button></p>
                </div>
            ))}

            {editInfo && (
                <div>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            placeholder="FirstName"
                            value={editCustomer.FirstName || ''}
                            onChange={(e) => setEditCustomer({...editCustomer, FirstName: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Midname"
                            value={editCustomer.Midname || ''}
                            onChange={(e) => setEditCustomer({...editCustomer, Midname: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Lastname"
                            value={editCustomer.Lastname || ''}
                            onChange={(e) => setEditCustomer({...editCustomer, Lastname: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="PhoneNumber"
                            value={editCustomer.PhoneNumber || ''}
                            onChange={(e) => setEditCustomer({...editCustomer, PhoneNumber: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={editCustomer.Email || ''}
                            onChange={(e) => setEditCustomer({...editCustomer, Email: e.target.value })}
                            required
                        />
                        {/* Add remaining fields in similar pattern */}
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditInfo(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

function CustomerProfile() {
    return (
        <div>
            <CustomerExample />
        </div>
    );
}

export default CustomerProfile;
