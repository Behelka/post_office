import React, { useState } from "react";
import "./PackagePortal.css";

const BasicTable = () => {
    // Sample data to display in the table
    const [data, setData] = useState([
        { package_id: 1, sender_id: 1, recipient_id: 1, destination_address: "123 Maple St, Chicago, IL 60601, USA", package_status: "Recieved" },
        { package_id: 2, sender_id: 2, recipient_id: 1, destination_address: "456 Oak Ave, Denver, CO 80203, USA", package_status: "Recieved" },
        { package_id: 3, sender_id: 3, recipient_id: 1, destination_address: "789 Pine Rd, Miami, FL 33101, USA", package_status: "Shipped" },
        { package_id: 4, sender_id: 4, recipient_id: 1, destination_address: "321 Elm Blvd, Dallas, TX 75201, USA", package_status: "Recieved" },
        { package_id: 5, sender_id: 5, recipient_id: 1, destination_address: "654 Cedar Ln, Seattle, WA 98101, USA", package_status: "Shipped" },
        { package_id: 6, sender_id: 6, recipient_id: 1, destination_address: "987 Birch Dr, Boston, MA 02108, USA", package_status: "Shipped" },
        { package_id: 7, sender_id: 7, recipient_id: 1, destination_address: "159 Walnut St, San Francisco, CA 94102, USA", package_status: "Recieved" },
        { package_id: 8, sender_id: 8, recipient_id: 1, destination_address: "753 Aspen Ct, Atlanta, GA 30301, USA", package_status: "Recieved" },
        { package_id: 9, sender_id: 9, recipient_id: 1, destination_address: "246 Willow Way, Portland, OR 97201, USA", package_status: "Shipped" },
        { package_id: 10, sender_id: 10, recipient_id: 1, destination_address: "864 Sycamore Cir, New York, NY 10001, USA", package_status: "Shipped" },
        { package_id: 11, sender_id: 11, recipient_id: 1, destination_address: "135 Palm Ave, Los Angeles, CA 90001, USA", package_status: "Shipped" },
        { package_id: 12, sender_id: 12, recipient_id: 1, destination_address: "468 Hickory St, Phoenix, AZ 85001, USA", package_status: "Recieved" },
        { package_id: 13, sender_id: 13, recipient_id: 1, destination_address: "579 Redwood Ter, Minneapolis, MN 55401, USA", package_status: "Shipped" },
        { package_id: 14, sender_id: 14, recipient_id: 1, destination_address: "702 Magnolia Dr, Houston, TX 77002, USA", package_status: "Shipped" },
        { package_id: 15, sender_id: 15, recipient_id: 1, destination_address: "190 Chestnut Blvd, Las Vegas, NV 89101, USA", package_status: "Shipped" },
    ]);

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
    const [editPackageStatus, setEditPackageStatus] = useState("Received");

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPackage = {
            package_id: data.length + 1,
            sender_id: senderId,
            recipient_id: recipientId,
            destination_address: `${houseNumber} ${street} ${suffix}, ${city}, ${state} ${zipCode}, ${country}`,
            package_status: packageStatus
        };
        setData([...data, newPackage]);

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
        setPackageStatus("Received");
    };

    const handleEdit = (index) => {
        setEditMode(true);
        setEditIndex(index);

        const pkg = data[index];
        setEditSenderId(pkg.sender_id);
        setEditRecipientId(pkg.recipient_id);
        setEditPackageStatus(pkg.package_status);
        
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

    const handleUpdate = (e) => {
        e.preventDefault();

        const updatedPackage = {
            package_id: data[editIndex].package_id,
            sender_id: editSenderId,
            recipient_id: editRecipientId,
            destination_address: `${editHouseNumber} ${editStreet} ${editSuffix}, ${editCity}, ${editState} ${editZipCode}, ${editCountry}`,
            package_status: editPackageStatus
        };

        const updatedData = data.map((pkg, index) =>
            index === editIndex ? updatedPackage : pkg
        );

        setData(updatedData);
        setEditMode(false);
        setEditIndex(null);
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
                <select
                    value={packageStatus}
                    onChange={(e) => setPackageStatus(e.target.value)}
                >
                    <option value="Received">Received</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                </select>
                <button type="submit">Add Package</button>
            </form>

            <h2>Current Packages</h2>
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Package ID</th>
                            <th>Sender ID</th>
                            <th>Recipient ID</th>
                            <th>Destination Address</th>
                            <th>Package Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.package_id}>
                                <td>
                                    <a href="#" onClick={() => handleEdit(index)}>
                                        {item.package_id}
                                    </a>
                                </td>
                                <td>{item.sender_id}</td>
                                <td>{item.recipient_id}</td>
                                <td>{item.destination_address}</td>
                                <td>{item.package_status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editMode && (
                <div>
                    <h2>Edit Package {editIndex + 1}</h2>
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
                        <select
                            value={editPackageStatus}
                            onChange={(e) => setEditPackageStatus(e.target.value)}
                        >
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

function PackagePortal() {
    return (
        <div>
            <BasicTable />
        </div>
    );
}

export default PackagePortal;