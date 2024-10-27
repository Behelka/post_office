import React, { useState } from "react";
import "./EmployeeProfile.css"


const CustomerExample=()=>{
    const [customerinfo, setcustomerinfo]=useState([
        {CustomerID:1,FirstName:"Peter", Midname:"B", Lastname:"Parker", PhoneNumber:"0123456789" , HouseNumber:"11707", Street:"Airport", Suffix:"Blvd" , City:"Meadows Place", State:"TX" , ZipCode:"77477" , Country:"USA", Email:"parker@gmail.com"},

    ]);


    const [searchCustomer,setSearchCustomer]=useState(null);

    const [customerID, setcustomerID]= useState('');
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

    const [isFocused,setIsFocused]=useState(false);
    const handleFocus=()=>setIsFocused(true);
    const handleBlur=()=>setIsFocused(false);



    const handleSubmit=(e)=>{
        e.preventDefault();
        const result=customerinfo.filter((item)=>item.CustomerID===Number(customerID));

        if (result.length>0){
            const mergedCustomer = result.map((customer) => ({
                ID: customer.CustomerID,
                NAME: `${customer.FirstName} ${customer.Midname} ${customer.Lastname}`.trim(),
                ADDRESS: `${customer.HouseNumber} ${customer.Street} ${customer.Suffix}, ${customer.City}, ${customer.State} ${customer.ZipCode}, ${customer.Country}`,
                PHONENUMBER: customer.PhoneNumber,
                EMAIL: customer.Email,
            }));

            setSearchCustomer(mergedCustomer);

        }
        else{
            setSearchCustomer([{error:'Customer ID not found'}]);

        }
        setcustomerID("");
    };

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

    const handleEdit=(index)=>{
        setEditInfo(true);
        setEditIndex(index);
        const Info=customerinfo[index];
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
        setEditCountry(Info.Country)

    };


    const handleUpdate=(e)=>{
        e.preventDefault();
        const updateInfo={
            CustomerID:Number(customerinfo[editIndex].CustomerID),
            FirstName:editFirstName,
            Midname:editMidName,
            Lastname:editLastName,
            PhoneNumber:editPhoneNumber,
            Email:editEmail,
            HouseNumber:editHouseNumber,
            Street:editStreet,
            Suffix:editSuffix,
            City:editCity,
            State:editState,
            ZipCode:editZipCode,
            Country:editCountry,
        }

        const updateCustomerInfo=customerinfo.map((customer,index)=>
            index===editIndex? updateInfo:customer

        );

        setcustomerinfo(updateCustomerInfo);

        const mergedCustomer = {
            ID: updateInfo.CustomerID,
            NAME: `${updateInfo.FirstName} ${updateInfo.Midname} ${updateInfo.Lastname}`.trim(),
            ADDRESS: `${updateInfo.HouseNumber} ${updateInfo.Street} ${updateInfo.Suffix}, 
                      ${updateInfo.City}, ${updateInfo.State} ${updateInfo.ZipCode}, ${updateInfo.Country}`,
            PHONENUMBER: updateInfo.PhoneNumber,
            EMAIL: updateInfo.Email,
          };

          setSearchCustomer([mergedCustomer]);

        setEditInfo(false);
        setEditIndex(null);

    };




    return(
        <div className="main_div">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={customerID}
                    onChange={(e)=>setcustomerID(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Enter git Customer ID"
                    required

                />
                <button type="submit">Search</button>
            </form>

            {searchCustomer &&(
            <div>
                {searchCustomer[0].error?(
                    <p>{searchCustomer[0].error}</p>
                ):(
                    <table border="1" cellPadding="10" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>CustomerID</th>
                                <th>Name</th>
                                <th>PhoneNumber</th>
                                <th>Address</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchCustomer.map((customer, index) => (
                                <tr key={index}>
                                    <td>{customer.ID}</td>
                                    <td>{customer.NAME}</td>
                                    <td>{customer.ADDRESS}</td>
                                    <td>{customer.PHONENUMBER}</td>
                                    <td>{customer.EMAIL}</td>
                                    <td><button onClick={()=>handleEdit(index)}>Edit</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


        )}
            {editInfo && (
                <div className="edit_div">
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            placeholder="FirstName"
                            value={editFirstName}
                            onChange={(e)=>setEditFirstName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Midname"
                            value={editMidName}
                            onChange={(e)=>setEditMidName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Lastname"
                            value={editLastName}
                            onChange={(e)=>setEditLastName(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="PhoneNumber"
                            value={editPhoneNumber}
                            onChange={(e)=>setEditPhoneNumber(e.target.value)}
                            className="number-input"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={editEmail}
                            onChange={(e)=>setEditEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="House Number"
                            value={editHouseNumber}
                            onChange={(e)=>setEditHouseNumber(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Street"
                            value={editStreet}
                            onChange={(e)=>setEditStreet(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Suffix"
                            value={editSuffix}
                            onChange={(e)=>setEditSuffix(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="City"
                            value={editCity}
                            onChange={(e)=>setEditCity(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="State"
                            value={editState}
                            onChange={(e)=>setEditState(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Zip Code"
                            value={editZipCode}
                            onChange={(e)=>setEditZipCode(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Country"
                            value={editCountry}
                            onChange={(e)=>setEditCountry(e.target.value)}
                            required
                        />
                        <button type="submit">Save</button>
                        <button onClick={()=>setEditInfo(false)}>Cancel</button>

                    </form>
                </div>
            )}
        </div>
    )

}











function EmployeeProfile() {
    return(
        <div>
            <CustomerExample/>
        </div>
    );
}

export default EmployeeProfile;