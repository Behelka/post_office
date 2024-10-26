//doesn't work yet
import React, { useState, useEffect } from "react";
import "./CustomerProfile.css";


const CustomerExample=()=>{
    const [customerinfo, setcustomerinfo]=useState([
        {CustomerID:1,FirstName:"Alex", Midname:"J", Lastname:"Smith", PhoneNumber:"987654321" , HouseNumber:"558", Street:"shadow", Suffix:"Blvd" , City:"Houston", State:"TX" , ZipCode:"77524" , Country:"USA", Email:"Smith@gmail.com", Balance:98},
        {CustomerID:2,FirstName:"B", Midname:"J", Lastname:"FF", PhoneNumber:"987654321" , HouseNumber:"558", Street:"shadow", Suffix:"Blvd" , City:"Houston", State:"TX" , ZipCode:"77524" , Country:"USA", Email:"Smith@gmail.com", Balance:98},
        {CustomerID:3,FirstName:"C", Midname:"J", Lastname:"GAG", PhoneNumber:"987654321" , HouseNumber:"558", Street:"shadow", Suffix:"Blvd" , City:"Houston", State:"TX" , ZipCode:"77524" , Country:"USA", Email:"Smith@gmail.com", Balance:98},
    ])

   
    const [customerID, setcustomerID]= useState(2);

    const [searchCustomer,setSearchCustomer]=useState(null);
    const [firstName, setFirstName]=useState('');
    const [midName, setMidName]=useState('');
    const [lastName, setLastName]=useState('');
    const [phoneNumber, setPhoneNumber]=useState('');
    const [email, setEmail]=useState('');
    const [HouseNumber, setHouseNumber] = useState("");
    const [Street, setStreet] = useState("");
    const [Suffix, setSuffix] = useState("");
    const [City, setCity] = useState("");
    const [State, setState] = useState("");
    const [ZipCode, setZipCode] = useState("");
    const [Country, setCountry] = useState("");
    const [Balance, setBalance] = useState("");

    const [mergedCustomer,setmergedCustomer]=useState([]);

    useEffect(() => {
        const filtered = customerinfo.filter(
            (customer) => customer.CustomerID === customerID
        );
    
        const merged = filtered.map((customer) => ({
            ID: customer.CustomerID,
            NAME: `${customer.FirstName} ${customer.Midname} ${customer.Lastname}`.trim(),
            ADDRESS: `${customer.HouseNumber} ${customer.Street} ${customer.Suffix}, 
                      ${customer.City}, ${customer.State} ${customer.ZipCode}, ${customer.Country}`,
            PHONENUMBER: customer.PhoneNumber,
            EMAIL: customer.Email,
            BALANCE: customer.Balance,
        }));
    
        setmergedCustomer(merged);
    }, [customerID, customerinfo]);
    
    //Edit

    const [editInfo,setEditInfo]=useState("");
    const [editIndex,setEditIndex]=useState("");

    const [editFirstName,setEditFirstName]=useState("");
    const [editMidName, setEditMidName]=useState("");
    const [editLastName, setEditLastName]=useState("");
    const [editPhoneNumber, setEditPhoneNumber]=useState("");
    const [editEmail, setEditEmail]=useState("");

    const [editHouseNumber, setEditHouseNumber] = useState("");
    const [editStreet, setEditStreet] = useState("");
    const [editSuffix, setEditSuffix] = useState("");
    const [editCity, setEditCity] = useState("");
    const [editState, setEditState] = useState("");
    const [editZipCode, setEditZipCode] = useState("");
    const [editCountry, setEditCountry] = useState("");
    const [editBalance, setEditBalance] = useState("");

    const handleEdit = (id) => {
        setEditInfo(true);
    

        const Info = customerinfo.find((customer) => customer.CustomerID === id);
    
        if (Info) {
            setcustomerID(Info.CustomerID);
            setEditFirstName(Info.FirstName);
            setEditMidName(Info.Midname);
            setEditLastName(Info.Lastname);
            setEditPhoneNumber(Info.PhoneNumber);
            setEditEmail(Info.Email);
            setEditHouseNumber(Info.HouseNumber);
            setEditStreet(Info.Street);
            setEditSuffix(Info.Suffix);
            setEditCity(Info.City);
            setEditState(Info.State);
            setEditZipCode(Info.ZipCode);
            setEditCountry(Info.Country);
            setEditBalance(Info.Balance);
        }
    };

    //Update

    const handleUpdate = (e) => {
        e.preventDefault();
    
        const updateInfo = {
            CustomerID: customerID,
            FirstName: editFirstName,
            Midname: editMidName,
            Lastname: editLastName,
            PhoneNumber: editPhoneNumber,
            Email: editEmail,
            HouseNumber: editHouseNumber,
            Street: editStreet,
            Suffix: editSuffix,
            City: editCity,
            State: editState,
            ZipCode: editZipCode,
            Country: editCountry,
            Balance: editBalance,
        };
    

        const updatedCustomerInfo = customerinfo.map((customer) =>
            customer.CustomerID === customerID ? updateInfo : customer
        );
    
        setcustomerinfo(updatedCustomerInfo);
    
        const mergedCustomer = {
            ID: updateInfo.CustomerID,
            NAME: `${updateInfo.FirstName} ${updateInfo.Midname} ${updateInfo.Lastname}`.trim(),
            ADDRESS: `${updateInfo.HouseNumber} ${updateInfo.Street} ${updateInfo.Suffix}, 
                      ${updateInfo.City}, ${updateInfo.State} ${updateInfo.ZipCode}, ${updateInfo.Country}`,
            PHONENUMBER: updateInfo.PhoneNumber,
            EMAIL: updateInfo.Email,
            BALANCE: updateInfo.Balance,
        };
    
        setSearchCustomer([mergedCustomer]);
    
        setEditInfo(false);
    };
    

    return (
        <div>
            <h1>Customer Information</h1>
            {mergedCustomer.map((customer,index) => (
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
                            value={editFirstName}
                            onChange={(e) => setEditFirstName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Midname"
                            value={editMidName}
                            onChange={(e) => setEditMidName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Lastname"
                            value={editLastName}
                            onChange={(e) => setEditLastName(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="PhoneNumber"
                            value={editPhoneNumber}
                            onChange={(e) => setEditPhoneNumber(e.target.value)}
                            className="number-input"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="House Number"
                            value={editHouseNumber}
                            onChange={(e) => setEditHouseNumber(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Street"
                            value={editStreet}
                            onChange={(e) => setEditStreet(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Suffix"
                            value={editSuffix}
                            onChange={(e) => setEditSuffix(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="City"
                            value={editCity}
                            onChange={(e) => setEditCity(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="State"
                            value={editState}
                            onChange={(e) => setEditState(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Zip Code"
                            value={editZipCode}
                            onChange={(e) => setEditZipCode(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Country"
                            value={editCountry}
                            onChange={(e) => setEditCountry(e.target.value)}
                            required
                        />
                        <button type="submit">Save</button>
                        <button onClick={() => setEditInfo(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );

}


/*
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

*/

function CustomerProfile() {
    return(
        <div>
            <CustomerExample/>
        </div>
    );
}

export default CustomerProfile;
