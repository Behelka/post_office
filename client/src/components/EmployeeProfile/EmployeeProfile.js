import React, { useState } from "react";
import "./EmployeeProfile.css"


const CustomerExample=()=>{
    const [customerinfo, setcustomerinfo]=useState([
        {CustomerID:1,FirstName:"Peter",Midname:"B",Lastname:"Parker",PhoneNumber:"0123456789",Address:"11707 W Airport Blvd, Meadows Place, TX 77477" ,Email:"parker@gmail.com"},
        {CustomerID:2,FirstName:"James ",Midname:"O",Lastname:"Parker",PhoneNumber:"9876543210",Address:"1820 Market St, St. Louis, MO 63103" ,Email:"James@gmail.com"},
        {CustomerID:3,FirstName:"Michael ",Midname:"D",Lastname:"Carter",PhoneNumber:"7132400866",Address:"169 Homan Ln, Centre Hall, PA 16828" ,Email:"Michael@gmail.com"},
        {CustomerID:4,FirstName:"Ethan ",Midname:"L",Lastname:"Reed",PhoneNumber:"7132400946",Address:"6000 Universal Blvd, Orlando, FL 32819" ,Email:"Ethan@gmail.com"},

    ]);



    const [customerID, setcustomerID]= useState('');
    const [searchCustomer,setSearchCustomer]=useState(null);
    const [isFocused,setIsFocused]=useState(false);
    const handleFocus=()=>setIsFocused(true);
    const handleBlur=()=>setIsFocused(false);

    const handleSubmit=(e)=>{
        e.preventDefault();
        const result=customerinfo.filter((item)=>item.CustomerID===Number(customerID));

        if (result.length>0){
            setSearchCustomer(result);
            setcustomerID("");
        }
        else{
            setSearchCustomer([{error:'Customer ID not found'}]);
            setcustomerID("");
        }

    };

    const [editInfo,setEditInfo]=useState("");
    const [editIndex,setEditIndex]=useState("");
    const [editFirstName,setEditFirstName]=useState("");
    const [editMidName, setEditMidName]=useState("");
    const [editLastName, setEditLastName]=useState("");
    const [editPhoneNumber, setEditPhoneNumber]=useState("");
    const [editAddress, setEditAddress]=useState("");
    const [editEmail, setEditEmail]=useState("");

    const handleEdit=(index)=>{
        setEditInfo(true);
        setEditIndex(index);
        const Info=customerinfo[index];
        setEditFirstName(Info.FirstName);
        setEditMidName(Info.Midname);
        setEditLastName(Info.Lastname);
        setEditPhoneNumber(Info.PhoneNumber);
        setEditAddress(Info.Address);
        setEditEmail(Info.Email)
    };


    const handleUpdate=(e)=>{
        e.preventDefault();
        const updateInfo={
            CustomerID:customerinfo[editIndex].CustomerID,
            FirstName:editFirstName,
            Midname:editMidName,
            Lastname:editLastName,
            PhoneNumber:editPhoneNumber,
            Address:editAddress,
            Email:editEmail,
        }

        const updateCustomerInfo=customerinfo.map((customer,index)=>
            index===editIndex? updateInfo:customer

        );

        setcustomerinfo(updateCustomerInfo);
        setSearchCustomer([updateInfo]);

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
                    placeholder="Enter Customer ID"
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
                                <th>FirstName</th>
                                <th>Midname</th>
                                <th>Lastname</th>
                                <th>PhoneNumber</th>
                                <th>Address</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchCustomer.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.CustomerID}</td>
                                    <td>{item.FirstName}</td>
                                    <td>{item.Midname}</td>
                                    <td>{item.Lastname}</td>
                                    <td>{item.PhoneNumber}</td>
                                    <td>{item.Address}</td>
                                    <td>{item.Email}</td>
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
                            required
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={editAddress}
                            onChange={(e)=>setEditAddress(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={editEmail}
                            onChange={(e)=>setEditEmail(e.target.value)}
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