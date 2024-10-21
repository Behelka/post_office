import React, { useState, useEffect } from "react";
import "./AddLocation.css";

const BasicTable = () => {
    const [data, setData] = useState([]);
    const [houseNumber, setHouseNumber] = useState("");
    const [street, setStreet] = useState("");
    const [suffix, setSuffix] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("");

    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editHouseNumber, setEditHouseNumber] = useState("");
    const [editStreet, setEditStreet] = useState("");
    const [editSuffix, setEditSuffix] = useState("");
    const [editCity, setEditCity] = useState("");
    const [editState, setEditState] = useState("");
    const [editZipCode, setEditZipCode] = useState("");
    const [editCountry, setEditCountry] = useState("");

    // Fetch locations from the API
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/location');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                const result = await response.json();
                console.log(result); // Log the result to see its structure
                // Process the result as needed
                const formattedData = result.map((item, index) => ({
                    location_id: index + 1, // Or assign from DB if available
                    address: `
                    ${item.Location_Address_House_Number} 
                    ${item.Location_Address_Street} 
                    ${item.Location_Address_Suffix}, 
                    ${item.Location_Address_City}, 
                    ${item.Location_Address_State} 
                    ${item.Location_Address_Zip_Code}, 
                    ${item.Location_Address_Country}`
                }));
                setData(formattedData);

            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        
        
        fetchLocations();
    }, []); 


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newLocation = {
            address: `${houseNumber} ${street} ${suffix}, ${city}, ${state} ${zipCode}, ${country}`
        };
       // console.log(newLocation);
        try {
            const response = await fetch('http://localhost:3000/api/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify(newLocation),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setData([...data, {
                location_id: data.length + 1,
                address: `${houseNumber} ${street} ${suffix}, ${city}, ${state} ${zipCode}, ${country}`
            }]);

            console.log(result);
            clearInputFields();
        } catch (error) {
            console.error('Error adding location:', error);
        }
    };
     

    const clearInputFields = () => {
        setHouseNumber("");
        setStreet("");
        setSuffix("");
        setCity("");
        setState("");
        setZipCode("");
        setCountry("");
    };

    const handleEdit = (index) => {
        setEditMode(true);
        setEditIndex(index);
        const location = data[index];
    
        // Trim and split the address properly
        const addressParts = location.address.trim().split(", ");
    
        // Remove newline characters and filter out empty strings
        const houseAndStreet = addressParts[0].trim().replace(/\n/g, '').split(" ").filter(Boolean);
    
        const city = addressParts[1].trim().replace(/\n/g, ''); // Trim and remove newline
        const stateZip = addressParts[2].trim().replace(/\n/g, '').split(" ").filter(Boolean); // Trim, remove newline, and split
        const country = addressParts[3].trim().replace(/\n/g, ''); // Trim and remove newline
    
        // Handle house number, street, and suffix
        const houseNumber = houseAndStreet[0];
        const street = houseAndStreet.slice(1, houseAndStreet.length - 1).join(" ");
        const suffix = houseAndStreet[houseAndStreet.length - 1];
    
        // Handle state and zip code
        const state = stateZip[0]; // First part as state
        const zipCode = stateZip.length > 1 ? stateZip[1] : ''; // Safely assign zip code if exists
    
        // Set the state for the edit form
        setEditHouseNumber(houseNumber);
        setEditStreet(street);
        setEditSuffix(suffix);
        setEditCity(city);
        setEditState(state);
        setEditZipCode(zipCode); // This should now populate correctly
        setEditCountry(country);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const updatedAddress = `${editHouseNumber} ${editStreet} ${editSuffix}, ${editCity}, ${editState} ${editZipCode}, ${editCountry}`;
        const updatedData = data.map((location, index) => 
            index === editIndex ? { ...location, address: updatedAddress } : location
        );

        setData(updatedData); 
        setEditMode(false);
        setEditIndex(null);
    };

    return (
        <div className="table-container">
            <h2>Add a new Location</h2>
            <form onSubmit={handleSubmit}>
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
                    placeholder="Suffix (e.g., St, Ave)"
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
                <button type="submit">Add Location</button>
            </form>
            <h2>Current Locations - Click On Location ID To Edit An Existing Location</h2>
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Location ID</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.location_id}>
                                <td>
                                    <button onClick={() => handleEdit(index)} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                                        {item.location_id}
                                    </button>
                                </td>
                                <td>{item.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editMode && (
                <div>
                    <h2>Edit Location {editIndex + 1}</h2>
                    <form onSubmit={handleUpdate}>
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
                        <button type="submit">Update Location</button>
                    </form>
                </div>
            )}
        </div>
    );
};

function AddLocation() {
    return (
        <div>
            <BasicTable />
        </div>
    );
}

export default AddLocation;