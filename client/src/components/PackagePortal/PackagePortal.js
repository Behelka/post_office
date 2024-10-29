import React, { useState, useEffect, useCallback } from "react";
import Modal from '../Modal/Modal';
import { useNavigate } from "react-router-dom";
import "./PackagePortal.css";


const url = process.env.REACT_APP_SERVER_URL;


const BasicTable = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // State for filtered data
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [searchColumn, setSearchColumn] = useState("sender_name"); // Default search column
    const [formValues, setFormValues] = useState({
        senderId: "",
        recipientId: "",
        houseNumber: "",
        street: "",
        suffix: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        length: "",
        width: "",
        height: "",
        weight: "",
        shippingMethod: "Ground",
        packageStatus: "Received",
    });
    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
    const [packageToDelete, setPackageToDelete] = useState(null); // Store package ID to delete

    const formatPackageItem = (item) => ({
        package_id: item.Package_ID,
        sender_id: item.Sender_ID,
        sender_name: `${item.Sender_First_Name} ${item.Sender_Last_Name}`,
        recipient_id: item.Recipient_ID,
        recipient_name: `${item.Recipient_First_Name} ${item.Recipient_Last_Name}`,
        destination_address: `${item.Package_House_Number} ${item.Package_Street} ${item.Package_Suffix || ''}, ${item.Package_City}, ${item.Package_State} ${item.Package_Zip_Code}, ${item.Package_Country}`,
        houseNumber: item.Package_House_Number,
        street: item.Package_Street,
        suffix: item.Package_Suffix,
        city: item.Package_City,
        state: item.Package_State,
        zipCode: item.Package_Zip_Code,
        country: item.Package_Country,
        package_status: item.Package_Status,
        length: item.Package_Length,
        width: item.Package_Width,
        height: item.Package_Height,
        weight: item.Package_Weight,
        shipping_method: item.Package_Shipping_Method,
        shipping_cost: item.Package_Shipping_Cost
        });

    const fetchPackage = useCallback(async () => {
        try {
            const response = await fetch(`${url}/api/PackagePortal`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            const formattedData = result.map(formatPackageItem);
            setData(formattedData);
            setFilteredData(formattedData); // Set filtered data initially
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    }, []);

    useEffect(() => {
        fetchPackage();
    }, [fetchPackage]);

    useEffect(() => {
        // Filter data whenever searchQuery or searchColumn changes
        const filtered = data.filter(pkg => {
            const valueToSearch = pkg[searchColumn]?.toString().toLowerCase() || ''; // Get the value to search based on the selected column
            return valueToSearch.includes(searchQuery.toLowerCase());
        });
        setFilteredData(filtered);
    }, [searchQuery, searchColumn, data]); // Re-run filtering on searchQuery, searchColumn, or data change

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleColumnChange = (e) => {
        setSearchColumn(e.target.value);
        setSearchQuery(""); // Reset search query when changing column
    };

    const handleAddStop = (packageId) => {
        navigate(`/stops/${packageId}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPackage = { ...formValues };

        try {
            const response = await fetch(`${url}/api/PackagePortal`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPackage),
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            setData((prev) => [...prev, formatPackageItem(result)]);
            setFilteredData((prev) => [...prev, formatPackageItem(result)]); // Update filtered data
            setFormValues({
                senderId: "", recipientId: "", houseNumber: "", street: "", suffix: "", city: "", state: "", zipCode: "", country: "", length: "", width: "", height: "", weight: "", shippingMethod: "Ground", packageStatus: "Received"
            });
        } catch (error) {
            console.error('Error adding package:', error);
        }
    };

    const handleEdit = (index) => {
        setEditMode(true);
        setEditIndex(index);
        const pkg = filteredData[index]; // Use filtered data for editing

        setFormValues({
            senderId: pkg.sender_id,
            recipientId: pkg.recipient_id,
            houseNumber: pkg.houseNumber || '',
            street: pkg.street || '',
            suffix: pkg.suffix || '',
            city: pkg.city || '',
            state: pkg.state || '',
            zipCode: pkg.zipCode || '',
            country: pkg.country || '',
            packageStatus: pkg.package_status,
            length: pkg.length,
            width: pkg.width,
            height: pkg.height,
            weight: pkg.weight,
            shippingMethod: pkg.shipping_method,
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedPackage = { ...formValues, package_id: filteredData[editIndex].package_id };

        try {
            const response = await fetch(`${url}/api/PackagePortal/${data[editIndex].package_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPackage),
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            await fetchPackage();
            resetEditFields();
        } catch (error) {
            console.error('Error updating package:', error);
        }
    };

    const resetEditFields = () => {
        setEditMode(false);
        setEditIndex(null);
        setFormValues({
            senderId: "",
            recipientId: "",
            houseNumber: "",
            street: "",
            suffix: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            length: "",
            width: "",
            height: "",
            weight: "",
            shippingMethod: "Ground",
            packageStatus: "Received",
        });
    }

    const handleDelete = (package_id) => {
        setPackageToDelete(package_id); // Set the package to delete
        setIsModalOpen(true); // Open the modal
    };

    const confirmDelete = async () => {
        if (!packageToDelete) return;

        try {
            const response = await fetch(`${url}/api/PackagePortal/${packageToDelete}`, { method: 'PATCH' });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            await fetchPackage();
            setIsModalOpen(false); // Close modal after deletion
            setPackageToDelete(null); // Clear package to delete
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

    return (
        <div className="table-container">
            <h2>{editMode ? "Edit Package" : "Add Package"}</h2>
            <form onSubmit={editMode ? handleUpdate : handleSubmit}>
                <input type="text" name="senderId" placeholder="Sender ID" value={formValues.senderId} onChange={handleChange} required />
                <input type="text" name="recipientId" placeholder="Recipient ID" value={formValues.recipientId} onChange={handleChange} required />
                <input type="text" name="houseNumber" placeholder="House Number" value={formValues.houseNumber} onChange={handleChange} required />
                <input type="text" name="street" placeholder="Street" value={formValues.street} onChange={handleChange} required />
                <input type="text" name="suffix" placeholder="Suffix" value={formValues.suffix} onChange={handleChange} required />
                <input type="text" name="city" placeholder="City" value={formValues.city} onChange={handleChange} required />
                <input type="text" name="state" placeholder="State" value={formValues.state} onChange={handleChange} required />
                <input type="text" name="zipCode" placeholder="Zip Code" value={formValues.zipCode} onChange={handleChange} required />
                <input type="text" name="country" placeholder="Country" value={formValues.country} onChange={handleChange} required />
                <input type="number" name="length" placeholder="Length" value={formValues.length} onChange={handleChange} required />
                <input type="number" name="width" placeholder="Width" value={formValues.width} onChange={handleChange} required />
                <input type="number" name="height" placeholder="Height" value={formValues.height} onChange={handleChange} required />
                <input type="number" name="weight" placeholder="Weight" value={formValues.weight} onChange={handleChange} required />
                <select name="shippingMethod" value={formValues.shippingMethod} onChange={handleChange}>
                    <option value="Ground">Ground</option>
                    <option value="Air">Air</option>
                    <option value="Express">Express</option>
                </select>
                <select name="packageStatus" value={formValues.packageStatus} onChange={handleChange}>
                    <option value="Received">Received</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                </select>
                <button type="submit">{editMode ? "Update Package" : "Add Package"}</button>
                <button type="button" onClick={resetEditFields}>Cancel</button>
            </form>

            <select value={searchColumn} onChange={handleColumnChange}>
                <option value="package_id">Package ID</option>
                <option value="sender_name">Sender Name</option>
                <option value="recipient_name">Recipient Name</option>
                <option value="destination_address">Destination Address</option>
            </select>
            <input 
                type="text" 
                placeholder={`Search by ${searchColumn.replace('_', ' ')}`} 
                value={searchQuery} 
                onChange={handleSearchChange} 
            />
            <div className="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th>Package ID</th>
                        <th>Sender</th>
                        <th>Recipient</th>
                        <th>Destination</th>
                        <th>Status</th>
                        <th>Length</th>
                        <th>Width</th>
                        <th>Height</th>
                        <th>Weight</th>
                        <th>shipping_method</th>
                        <th>shipping_cost</th>
                        <th>Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((pkg, index) => (
                        <tr key={pkg.package_id}>
                            <td>{pkg.package_id}</td>
                            <td>{pkg.sender_name}</td>
                            <td>{pkg.recipient_name}</td>
                            <td>{pkg.destination_address}</td>
                            <td>{pkg.package_status}</td>
                            <td>{pkg.length}</td>
                            <td>{pkg.width}</td>
                            <td>{pkg.height}</td>
                            <td>{pkg.weight}</td>
                            <td>{pkg.shipping_method}</td>
                            <td>{pkg.shipping_cost}</td>
                            <td>
                                <button onClick={() => handleEdit(index)}>Edit</button>
                                <button onClick={() => handleAddStop(pkg.package_id)} style={{ marginLeft: '10px' }}>Stops</button>
                                <button onClick={() => handleDelete(pkg.package_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Close modal
                onConfirm={confirmDelete} // Confirm deletion
            />
        </div>
    );
};

export default BasicTable;
