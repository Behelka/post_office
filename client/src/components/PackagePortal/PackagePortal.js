import React, { useState, useEffect } from "react";
import "./PackagePortal.css";

const BasicTable = () => {
    // Sample data to display in the table
    const [data, setData] = useState([]);

    // State for form inputs
    const [senderId, setSenderId] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [street, setStreet] = useState("");
    const [suffix, setSuffix] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("");
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");  // Added weight state
    const [shippingMethod, setShippingMethod] = useState("Ground");
    const [packageStatus, setPackageStatus] = useState("Received");

    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editSenderId, setEditSenderId] = useState("");
    const [editRecipientId, setEditRecipientId] = useState("");
    const [editHouseNumber, setEditHouseNumber] = useState("");
    const [editStreet, setEditStreet] = useState("");
    const [editSuffix, setEditSuffix] = useState("");
    const [editCity, setEditCity] = useState("");
    const [editState, setEditState] = useState("");
    const [editZipCode, setEditZipCode] = useState("");
    const [editCountry, setEditCountry] = useState("");
    const [editLength, setEditLength] = useState("");
    const [editWidth, setEditWidth] = useState("");
    const [editHeight, setEditHeight] = useState("");
    const [editWeight, setEditWeight] = useState(""); // Added weight edit state
    const [editShippingMethod, setEditShippingMethod] = useState("Ground");
    //const [editShippingCost, setEditShippingCost] = useState("");
    const [editPackageStatus, setEditPackageStatus] = useState("Received");

    function formatPackageItem(item) {
        return {
            package_id: item.Package_ID,
            sender_id: item.Sender_ID, // Assuming this is the ID you want to display
            sender_name: `${item.Sender_First_Name} ${item.Sender_Last_Name}`, // Combined sender name
            recipient_id: item.Recipient_ID, // Assuming this is the ID you want to display
            recipient_name: `${item.Recipient_First_Name} ${item.Recipient_Last_Name}`, // Combined recipient name
            destination_address: `${item.Package_House_Number} ${item.Package_Street} ${item.Package_Suffix || ''}, ${item.Package_City}, ${item.Package_State} ${item.Package_Zip_Code}, ${item.Package_Country}`, // Combined destination address
            package_status: item.Package_Status,
            length: item.Package_Length,
            width: item.Package_Width,
            height: item.Package_Height,
            weight: item.Package_Weight, // Added weight field
            shipping_method: item.Package_Shipping_Method,
            shipping_cost: item.Package_Shipping_Cost,
        };
    }
    

    const fetchPackage = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/PackagePortal');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
    
            const formattedData = result.map(formatPackageItem);

            setData(formattedData);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };

    useEffect(() => {
        fetchPackage();
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPackage = {
            sender_id: senderId,
            recipient_id: recipientId,
            packageHouseNumber: houseNumber,
            packageStreet: street,
            packageSuffix: suffix,
            packageCity: city,
            packageState: state,
            packageZipCode: zipCode,
            packageCountry: country,
            packageStatus: packageStatus,
            packageLength: length,
            packageWidth: width,
            packageHeight: height,
            packageWeight: weight,
            packageShippingMethod: shippingMethod,
        };

        try {
            const response = await fetch('http://localhost:3001/api/PackagePortal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPackage),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();

            setData(prev => [...prev, formatPackageItem(result)]);

        } catch (error) {
            console.error('Error adding package:', error);
        }

        // Clear input fields
        setSenderId("");
        setRecipientId("");
        setHouseNumber("");
        setStreet("");
        setSuffix("");
        setCity("");
        setState("");
        setZipCode("");
        setCountry("");
        setLength("");
        setWidth("");
        setHeight("");
        setWeight(""); // Clear weight
        setShippingMethod("Ground");
        setPackageStatus("Received");
    };

    const handleEdit = (index) => {
        setEditMode(true);
        setEditIndex(index);

        const pkg = data[index];
        setEditSenderId(pkg.sender_id);
        setEditRecipientId(pkg.recipient_id);
        setEditPackageStatus(pkg.package_status);
        setEditLength(pkg.length);
        setEditWidth(pkg.width);
        setEditHeight(pkg.height);
        setEditWeight(pkg.weight); // Set edit weight
        setEditShippingMethod(pkg.shipping_method);
        //setEditShippingCost(pkg.shipping_cost);
        
        // Parse the destination address
        const addressParts = pkg.destination_address.split(", ");
        const houseAndStreet = addressParts[0].split(" ");
        const city = addressParts[1];
        const stateZip = addressParts[2].split(" ");
        const country = addressParts[3];

        const houseNumber = houseAndStreet[0];
        const street = houseAndStreet.slice(1, houseAndStreet.length - 1).join(" ");
        const suffix = houseAndStreet[houseAndStreet.length - 1];
        const state = stateZip[0];
        const zipCode = stateZip[1];

        setEditHouseNumber(houseNumber);
        setEditStreet(street);
        setEditSuffix(suffix);
        setEditCity(city);
        setEditState(state);
        setEditZipCode(zipCode);
        setEditCountry(country);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
    
        const updatedPackage = {
            package_id: data[editIndex].package_id,
            sender_id: editSenderId,
            recipient_id: editRecipientId,
            packageHouseNumber: editHouseNumber,
            packageStreet: editStreet,
            packageSuffix: editSuffix,
            packageCity: editCity,
            packageState: editState,
            packageZipCode: editZipCode,
            packageCountry: editCountry,
            packageStatus: editPackageStatus,
            packageLength: editLength,
            packageWidth: editWidth,
            packageHeight: editHeight,
            packageWeight: editWeight,
            packageShippingMethod: editShippingMethod, // Corrected this

        };
    
        try {
            const response = await fetch('http://localhost:3001/api/PackagePortal', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPackage),
            });
    
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            const result = await response.json();
    
            // Update the data array with the updated package info
            const updatedData = data.map(item => formatPackageItem(item, result));

    
            setData(updatedData); // Set the updated data
            setEditMode(false); // Turn off edit mode
            setEditIndex(null); // Reset edit index
        } catch (error) {
            console.error('Error updating package:', error);
        }
    };
    

    const handleDelete = async (package_id) => {
    
        try {
            const response = await fetch(`http://localhost:3001/api/PackagePortal/${package_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Update the local state to reflect deletion without reloading the page
            setData(data.map(packageItem =>
                packageItem.Package_ID === package_id ? { ...packageItem, Delete_Location: 1 } : packageItem
            ));
    
            fetchPackage(); // Update the website display
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };
    

    return (
        <div className="table-container">
            <h2>Add a New Package</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Sender ID"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Recipient ID"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="House Number"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Suffix"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Package Length (In)"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Package Width (In)"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Package Height (In)"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Package Weight (Lbs)"
                    value={weight} // Updated weight field
                    onChange={(e) => setWeight(e.target.value)}
                    required
                />
                <select
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                >
                    <option value="Ground">Ground</option>
                    <option value="Air">Air</option>
                    <option value="Express">Overnight</option>
                </select>
                <button type="submit">Add Package</button>
            </form>

            <h2>Current Packages - Click On Package ID To Edit An Existing Package</h2>
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Package ID</th>
                            <th>Sender</th>
                            <th>Recipient</th>
                            <th>Destination Address</th>
                            <th>Package Status</th>
                            <th>Length (In)</th>
                            <th>Width (In)</th>
                            <th>Height (In)</th>
                            <th>Weight (Lbs)</th>
                            <th>Shipping Method</th>
                            <th>Shipping Cost</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data.map((item, index) => (
                        <tr key={item.package_id}>
                            <td>
                            <button onClick={() => handleEdit(index)} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                                        {item.package_id}
                                    </button>
                            </td>
                            <td>{item.sender_name}</td> {/* Updated to display sender name */}
                            <td>{item.recipient_name}</td> {/* Updated to display recipient name */}
                            <td>{item.destination_address}</td>
                            <td>{item.package_status}</td>
                            <td>{item.length}</td>
                            <td>{item.width}</td>
                            <td>{item.height}</td>
                            <td>{item.weight}</td>
                            <td>{item.shipping_method}</td>
                            <td>{item.shipping_cost}</td>
                            <td>
                                <button className="button-red" onClick={() => handleDelete(item.package_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {editMode && (
                <div className="edit-form">
                    <h2>Edit Package {data[editIndex].package_id}</h2>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="number"
                            placeholder="Sender ID"
                            value={editSenderId}
                            onChange={(e) => setEditSenderId(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Recipient ID"
                            value={editRecipientId}
                            onChange={(e) => setEditRecipientId(e.target.value)}
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
                        <input
                            type="number"
                            placeholder="Length"
                            value={editLength}
                            onChange={(e) => setEditLength(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Width"
                            value={editWidth}
                            onChange={(e) => setEditWidth(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Height"
                            value={editHeight}
                            onChange={(e) => setEditHeight(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Weight"
                            value={editWeight} // Update weight in edit form
                            onChange={(e) => setEditWeight(e.target.value)}
                            required
                        />
                        <select
                            value={editShippingMethod}
                            onChange={(e) => setEditShippingMethod(e.target.value)}
                        >
                            <option value="Ground">Ground</option>
                            <option value="Air">Air</option>
                            <option value="Express">Express</option>
                        </select>
                        <select value={editPackageStatus} onChange={(e) => setEditPackageStatus(e.target.value)}>
                            <option value="Received">Received</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                        <button type="submit">Update Package</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BasicTable;