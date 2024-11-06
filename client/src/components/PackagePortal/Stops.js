import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Modal from '../Modal/Modal';

import { SERVER_URL } from "../../App";

const Stops = () => {
    const { packageId } = useParams();
    const [stops, setStops] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [arrivalDate, setArrivalDate] = useState("");
    const [departureDate, setDepartureDate] = useState("");

    const [editStopId, setEditStopId] = useState(null);
    const [editArrivalDate, setEditArrivalDate] = useState("");
    const [editDepartureDate, setEditDepartureDate] = useState("");
    const [editLocationId, setEditLocationId] = useState("");
    const [stopToDelete, setStopToDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

    const stopsPerPage = 20;


    const fetchStops = useCallback(async () => {
        const formatStopItem = (item) => ({
            stop_id: item.Stop_ID,
            stop_location: `${item.Location_Address_House_Number} ${item.Location_Address_Street} ${item.Location_Address_Suffix || ''}, ${item.Location_Address_City}, 
                            ${item.Location_Address_State} ${item.Location_Address_Zip_Code}, ${item.Location_Address_Country}`,
            arrival_date: formatDate(item.Stop_Arrival_Date),
            departure_date: item.Stop_Departure_Date ? formatDate(item.Stop_Departure_Date) : "Not Departed",
            location_id: item.Location_ID  // Ensure this is included
        });
        try {
            const response = await fetch(`${SERVER_URL}/Stops/${packageId}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            const formattedData = result.map(formatStopItem);
            setStops(formattedData);
        } catch (error) {
            console.error('Error fetching stops:', error);
        }
    }, [packageId]);

    const fetchLocations = useCallback(async () => {
        try {
            const response = await fetch(`${SERVER_URL}/api/location`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            const filteredLocations = result.filter(location =>
                `${location.Location_ID} ${location.Location_Address_House_Number} ${location.Location_Address_Street} ${location.Location_Address_Suffix || ''}, ${location.Location_Address_City}, 
                        ${location.Location_Address_State} ${location.Location_Address_Zip_Code}, ${location.Location_Address_Country}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
            setLocations(filteredLocations);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    },[searchTerm]);

    useEffect(() => {
        fetchStops();
    }, [fetchStops,packageId]);

    useEffect(() => {
        if (searchTerm) {
            fetchLocations();
        } else {
            setLocations([]); // Clear locations if search term is empty
        }
    }, [fetchLocations,searchTerm]);

    const handleAddStop = async (e) => {
        e.preventDefault();
        if (!selectedLocation) {
            alert("Please select a location.");
            return;
        }

        const newStop = {
            location: selectedLocation.Location_ID,
            arrival_date: formatToMySQLDate(arrivalDate), // Convert here
            departure_date: formatToMySQLDate(departureDate), // Convert here
            Stop_Package_ID: packageId,
        };

        try {
            const response = await fetch(`${SERVER_URL}/Stops/${packageId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newStop),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            await fetchStops();
            resetFormFields();
        } catch (error) {
            console.error("Error adding stop:", error);
        }
    };

    const handleEditStop = (stop) => {
        setEditStopId(stop.stop_id);
        setEditArrivalDate(formatToLocalDate(stop.arrival_date));
        setEditDepartureDate(stop.departure_date === "Not Departed" ? "" : formatToLocalDate(stop.departure_date));
        setEditLocationId(stop.location_id || ""); // Set the location ID for editing
    };

    const formatToLocalDate = (dateString) => {
        const date = new Date(dateString); // Assume dateString is in UTC
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16); // Adjust for timezone offset
    };


    const handleUpdateStop = async (e) => {
        e.preventDefault();
    
        const updatedStop = {
            location: editLocationId, // Add location ID to the updated stop
            arrival_date: formatToMySQLDate(editArrivalDate),
            departure_date: formatToMySQLDate(editDepartureDate),
        };
    
        try {
            const response = await fetch(`${SERVER_URL}/Stops/${editStopId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedStop),
            });
    
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            await fetchStops();
            resetEditFields();
        } catch (error) {
            console.error("Error updating stop:", error);
        }
    };

    const formatToMySQLDate = (dateString) => {
        if (!dateString) return null; // Handle empty dates
        const localDate = new Date(dateString);
        return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' '); // Adjust to UTC
    };

    const handleDelete = (stop_id) => {
        setStopToDelete(stop_id); // Set the stop to delete
        setIsModalOpen(true); // Open the modal
    };

    const confirmDelete = async () => {
        if (!stopToDelete) return;

        try {
            const response = await fetch(`${SERVER_URL}/Stops/${stopToDelete}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            // Fetch updated stops after deletion
            await fetchStops();
            setIsModalOpen(false); // Close modal after deletion
            setStopToDelete(null); // Clear stop to delete
        } catch (error) {
            console.error('Error deleting stop:', error);
        }
    };


    const resetFormFields = () => {
        setSelectedLocation(null);
        setArrivalDate("");
        setDepartureDate(""); // Clear departure date after adding
    };

    const resetEditFields = () => {
        setEditStopId(null);
        setEditArrivalDate("");
        setEditDepartureDate("");
        setSelectedLocation(null); // Clear selected location for edit
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleString(undefined, options); // Use locale string for proper formatting
    };

    // Pagination logic
    const indexOfLastStop = currentPage * stopsPerPage;
    const indexOfFirstStop = indexOfLastStop - stopsPerPage;
    const currentStops = stops.slice(indexOfFirstStop, indexOfLastStop);
    const totalPages = Math.ceil(stops.length / stopsPerPage);

    return (
        <div className="table-container">
            <h2>Stops for Package ID: {packageId}</h2>
    
            {/* Adding Fields Above the Table */}
            <div style={{ marginTop: '20px' }}>
                <h3>Add New Stop</h3>
                <form onSubmit={handleAddStop}>
                    <input
                        type="datetime-local"
                        placeholder="Arrival Date"
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                        required
                    />
                    <input
                        type="datetime-local"
                        placeholder="Departure Date"
                        value={departureDate}
                        onChange={(e) => {
                            const depDate = e.target.value;
                            if (depDate && depDate < arrivalDate) {
                                alert("Departure date cannot be before arrival date.");
                            } else {
                                setDepartureDate(depDate);
                            }
                        }}
                    />

                    {/* New textbox for selected location ID */}
                    <input
                        type="text"
                        placeholder="Selected Location ID"
                        value={selectedLocation ? selectedLocation.Location_ID : ""}
                        readOnly // Make it read-only since it will be filled automatically
                    />

                    <input
                        type="text"
                        placeholder="Search for Location"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {locations.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Location ID</th>
                                    <th>Location</th>
                                    <th>Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations.map(location => (
                                    <tr key={location.Location_ID}>
                                        <td>{location.Location_ID}</td>
                                        <td>{`${location.Location_Address_House_Number} ${location.Location_Address_Street} ${location.Location_Address_Suffix || ''}, 
                                        ${location.Location_Address_City}, ${location.Location_Address_State} ${location.Location_Address_Zip_Code}, 
                                        ${location.Location_Address_Country}`}</td>
                                        <td>
                                            <button type="button" onClick={() => {
                                                setSelectedLocation(location);
                                                setSearchTerm(""); // Clear the search term
                                            }}>
                                                Select
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <button type="submit">Add Stop</button>
                </form>
            </div>
    
            <h3>Current Stops</h3>
            {currentStops.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Stop ID</th>
                            <th>Location</th>
                            <th>Arrival Date</th>
                            <th>Departure Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStops.map((stop) => (
                            <tr key={stop.stop_id}>
                                <td>
                                    <a 
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault(); 
                                            handleEditStop(stop); 
                                        }}
                                    >
                                        {stop.stop_id}
                                    </a>
                                </td>
                                <td>{stop.stop_location}</td>
                                <td>{stop.arrival_date}</td>
                                <td>{stop.departure_date}</td>
                                <td>
                                    <button onClick={() => handleDelete(stop.stop_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No stops available</p>
            )}
            <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)} 
                        onConfirm={confirmDelete} 
                    />

            {/* Editing Fields Below the Table */}
            {editStopId && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Edit Stop {editStopId}</h3>
                    <form onSubmit={handleUpdateStop}>
                        <input
                            type="text"
                            placeholder="Location ID"
                            value={editLocationId}
                            readOnly // Make it read-only since it will be filled automatically
                            required
                        />
                        <input
                            type="datetime-local"
                            placeholder="Edit Arrival Date"
                            value={editArrivalDate}
                            onChange={(e) => setEditArrivalDate(e.target.value)}
                            required
                        />
                        <input
                            type="datetime-local"
                            placeholder="Edit Departure Date"
                            value={editDepartureDate}
                            onChange={(e) => {
                                const depDate = e.target.value;
                                if (depDate && depDate < editArrivalDate) {
                                    alert("Departure date cannot be before arrival date.");
                                } else {
                                    setEditDepartureDate(depDate);
                                }
                            }}
                        />

                        <button type="submit">Update Stop</button>
                        <button type="button" onClick={resetEditFields}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );    
};

export default Stops;