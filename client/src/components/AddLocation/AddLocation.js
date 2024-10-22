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

    const fetchLocations = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/location');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            const formattedData = result.map((item) => ({
                location_id: item.Location_ID,
                address: `${item.Location_Address_House_Number} ${item.Location_Address_Street} ${item.Location_Address_Suffix || ''}, ${item.Location_Address_City}, ${item.Location_Address_State} ${item.Location_Address_Zip_Code}, ${item.Location_Address_Country}`
            }));
            setData(formattedData);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    // Fetch locations from the API
    useEffect(() => {
        fetchLocations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newLocation = {
            address: `${houseNumber} ${street} ${suffix}, ${city}, ${state} ${zipCode}, ${country}`
        };

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
                location_id: data.length + 1, // Replace with ID from result if returned
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

        const addressParts = location.address.trim().split(", ");

        const houseAndStreet = addressParts[0].trim().split(" ");
        const city = addressParts[1];
        const stateZip = addressParts[2].split(" ");
        const country = addressParts[3];

        setEditHouseNumber(houseAndStreet[0]);
        setEditStreet(houseAndStreet.slice(1, houseAndStreet.length - 1).join(" "));
        setEditSuffix(houseAndStreet[houseAndStreet.length - 1]);
        setEditCity(city);
        setEditState(stateZip[0]);
        setEditZipCode(stateZip[1] || '');
        setEditCountry(country);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatedLocation = {
            houseNumber: editHouseNumber,
            street: editStreet,
            suffix: editSuffix,
            city: editCity,
            state: editState,
            zipCode: editZipCode,
            country: editCountry,
        };

        try {
            const response = await fetch(`http://localhost:3000/api/location/${data[editIndex].location_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedLocation),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedData = data.map((location, idx) =>
                idx === editIndex ? { ...location, address: `${editHouseNumber} ${editStreet} ${editSuffix}, ${editCity}, ${editState} ${editZipCode}, ${editCountry}` } : location
            );

            setData(updatedData);
            setEditMode(false);
            setEditIndex(null);
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    const handleDelete = async (location_id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/location/${location_id}`, {
                method: 'PATCH',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setData(data.map(location =>
                location.location_id === location_id ? { ...location, Delete_Location: 1 } : location
            ));

            fetchLocations();
        } catch (error) {
            console.error('Error deleting location:', error);
        }
    };

    return (
        <div className="table-container">
            <h2>Add a new Location</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="House Number" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} required />
                <input type="text" placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} required />
                <input type="text" placeholder="Suffix (e.g., St, Ave)" value={suffix} onChange={(e) => setSuffix(e.target.value)} />
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
                <input type="text" placeholder="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                <button type="submit">Add Location</button>
            </form>

            <h2>Current Locations - Click On Location ID To Edit An Existing Location</h2>
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Location ID</th>
                            <th>Location Address</th>
                            <th className="center-header">Delete Location</th>
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
                                <td className="delete-column">
                                    <button className="button-red"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(item.location_id);
                                        }}
                                        style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editMode && (
                <div>
                    <h2>Edit Location {data[editIndex].location_id}</h2>
                    <form onSubmit={handleUpdate}>
                        <input type="text" placeholder="House Number" value={editHouseNumber} onChange={(e) => setEditHouseNumber(e.target.value)} required />
                        <input type="text" placeholder="Street" value={editStreet} onChange={(e) => setEditStreet(e.target.value)} required />
                        <input type="text" placeholder="Suffix" value={editSuffix} onChange={(e) => setEditSuffix(e.target.value)} />
                        <input type="text" placeholder="City" value={editCity} onChange={(e) => setEditCity(e.target.value)} required />
                        <input type="text" placeholder="State" value={editState} onChange={(e) => setEditState(e.target.value)} required />
                        <input type="text" placeholder="Zip Code" value={editZipCode} onChange={(e) => setEditZipCode(e.target.value)} required />
                        <input type="text" placeholder="Country" value={editCountry} onChange={(e) => setEditCountry(e.target.value)} required />
                        <button type="submit">Update Location</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BasicTable;
