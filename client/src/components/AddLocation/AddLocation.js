import React, { useState } from "react";
import "./AddLocation.css";

const BasicTable = () => {
    // Sample data to display in the table
    const [data, setData] = useState([
        { location_id: 1, address: "1000 Main St, Anytown, CA 90210, USA" },
        { location_id: 2, address: "123 Elm St, Springfield, IL 62701, USA" },
        { location_id: 3, address: "456 Oak St, Denver, CO 80203, USA" },
        { location_id: 4, address: "789 Maple Ave, Miami, FL 33101, USA" },
        { location_id: 5, address: "222 Walnut St, Portland, OR 97201, USA" },
        { location_id: 6, address: "555 Ash St, Chicago, IL 60601, USA" },
        { location_id: 7, address: "111 Spruce St, Boston, MA 02101, USA" },
        { location_id: 8, address: "789 Pine St, Seattle, WA 98101, USA" },
        { location_id: 9, address: "432 Cedar Ave, Los Angeles, CA 90001, USA" },
        { location_id: 10, address: "654 Birch St, San Francisco, CA 94101, USA" },
        { location_id: 11, address: "123 Fir St, Denver, CO 80205, USA" },
    ]);

    const [houseNumber, setHouseNumber] = useState("");
    const [street, setStreet] = useState("");
    const [suffix, setSuffix] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("");

    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);  // To track which row is being edited
    const [editHouseNumber, setEditHouseNumber] = useState("");
    const [editStreet, setEditStreet] = useState("");
    const [editSuffix, setEditSuffix] = useState("");
    const [editCity, setEditCity] = useState("");
    const [editState, setEditState] = useState("");
    const [editZipCode, setEditZipCode] = useState("");
    const [editCountry, setEditCountry] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const newLocation = {
            location_id: data.length + 1, // Increment location_id
            address: `${houseNumber} ${street} ${suffix}, ${city}, ${state} ${zipCode}, ${country}`
        };
        setData([...data, newLocation]); // Add new location to the data
        // Clear the input fields
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
        const addressParts = location.address.split(", ");
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

    const handleUpdate = (e) => {
        e.preventDefault();
        const updatedAddress = `${editHouseNumber} ${editStreet} ${editSuffix}, ${editCity}, ${editState} ${editZipCode}, ${editCountry}`;
        const updatedData = data.map((location, index) => 
            index === editIndex ? { ...location, address: updatedAddress } : location
        );

        setData(updatedData); // Update state with edited location
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
                                    <a href="#" onClick={() => handleEdit(index)}>
                                        {item.location_id}
                                    </a>
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