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
            arrival_date: convertUTCToTimeZone(item.Stop_Arrival_Date, getUserTimeZone()),
            departure_date: item.Stop_Departure_Date ? convertUTCToTimeZone(item.Stop_Departure_Date, getUserTimeZone()) : "Not Departed",
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


    function getUserTimeZone() {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        //console.log('User Time Zone:', timeZone);  // e.g., "America/Chicago"
        return timeZone;
    }
    
    //const userTimeZone = getUserTimeZone();  // Output: "America/Chicago", "Europe/London", etc.
    
    function convertUTCToTimeZone(utcDateString, timeZone) {
        if (!utcDateString) return null;
        
        // Parse the UTC date string (Ensure it is treated as UTC)
        const utcDate = new Date(utcDateString);  // The 'Z' is optional since UTC is assumed for ISO strings
        
        // Convert UTC to the specified time zone (e.g., "America/Chicago")
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,  // Optional: Set to false for 24-hour format
            timeZone: timeZone // Specify the desired time zone
        };
        
        // Return the formatted string in the desired time zone
        return utcDate.toLocaleString(undefined, options);
    }
    
    // Example usage:
    //const utcDateString = "2024-10-23T03:00:00.000Z";  // UTC time
    //const formattedDate = convertUTCToTimeZone(utcDateString, userTimeZone);
    //console.log(formattedDate);  // Output will be in the user's local time zone (e.g., CST)
    


    const convertLocalToUTC = (localDateString) => {
        if (!localDateString) return "";
    const localDate = new Date(localDateString);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    return new Date(localDate.toUTCString())
            .toISOString()
            .slice(0, 19)
    };

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
    }, [searchTerm]);

    useEffect(() => {
        fetchStops();
    }, [fetchStops, packageId]);

    useEffect(() => {
        if (searchTerm) {
            fetchLocations();
        } else {
            setLocations([]); // Clear locations if search term is empty
        }
    }, [fetchLocations, searchTerm]);

    const handleAddStop = async (e) => {
        e.preventDefault();
        if (!selectedLocation) {
            alert("Please select a location.");
            return;
        }

        const newStop = {
            location: selectedLocation.Location_ID,
            arrival_date: convertLocalToUTC(arrivalDate), // Convert here
            departure_date: convertLocalToUTC(departureDate), // Convert here
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

    
    const formatForDatetimeLocal = (dateString) => {
        if (!dateString) return ""; // Handle empty dates if needed
        const date = new Date(dateString);
    
        // Get local date and time components
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
    
        return `${year}-${month}-${day}T${hours}:${minutes}`; // Formats to "yyyy-MM-ddTHH:mm" in local time
    };
    
    
    // Update your function to use this simpler formatting
    const handleEditStop = (stop) => {
        //console.log(stop.arrival_date);
        setEditStopId(stop.stop_id);
        setEditArrivalDate(formatForDatetimeLocal(stop.arrival_date));
        //console.log(formatForDatetimeLocal(stop.arrival_date));
        setEditDepartureDate(
            stop.departure_date === "Not Departed" ? "" : formatForDatetimeLocal(stop.departure_date)
        );
        setEditLocationId(stop.location_id || ""); // Set the location ID for editing
    };
    


    const handleUpdateStop = async (e) => {
        e.preventDefault();

        const updatedStop = {
            location: editLocationId, // Add location ID to the updated stop
            arrival_date: convertLocalToUTC(editArrivalDate),
            departure_date: convertLocalToUTC(editDepartureDate),
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
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleEditStop(stop);
                                        }}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "blue",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {stop.stop_id}
                                    </button>

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