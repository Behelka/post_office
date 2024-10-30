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
            arrival_date: formatDate(arrivalDate),
            departure_date: formatDate(departureDate),
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
        setEditArrivalDate(stop.arrival_date);
        setEditDepartureDate(stop.departure_date === "Not Departed" ? "" : stop.departure_date);
    };

    const handleUpdateStop = async (e) => {
        e.preventDefault();

        const updatedStop = {
            arrival_date: formatDate(editArrivalDate),
            departure_date: formatDate(editDepartureDate),
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
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = date.toLocaleDateString(undefined, options);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${ampm}`;
        return `${formattedDate} ${formattedTime}`;
    };

    // Pagination logic
    const indexOfLastStop = currentPage * stopsPerPage;
    const indexOfFirstStop = indexOfLastStop - stopsPerPage;
    const currentStops = stops.slice(indexOfFirstStop, indexOfLastStop);
    const totalPages = Math.ceil(stops.length / stopsPerPage);

    return (
        <div className="table-container">
            <h2>Stops for Package ID: {packageId}</h2>

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
                                <td>{stop.stop_id}</td>
                                <td>{stop.stop_location}</td>
                                <td>{stop.arrival_date}</td>
                                <td>{stop.departure_date}</td>
                                <td>
                                    <button onClick={() => handleEditStop(stop)}>Edit</button>
                                    <button onClick={() => handleDelete(stop.stop_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)} // Close modal
                        onConfirm={confirmDelete} // Confirm deletion
                    />
                </table>
            ) : (
                <p>No stops available</p>
            )}

            {/* Pagination Controls */}
            <div style={{ marginTop: '20px' }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        style={{ margin: '0 5px', backgroundColor: currentPage === index + 1 ? '#007BFF' : 'transparent', color: currentPage === index + 1 ? 'white' : 'black' }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* Adding Fields */}
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
                                            <button type="button" onClick={() => setSelectedLocation(location)}>
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

            {/* Editing Fields */}
            {editStopId && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Edit Stop</h3>
                    <form onSubmit={handleUpdateStop}>
                        <input
                            type="datetime-local"
                            placeholder="Edit Arrival Date"
                            value={stops.arrival_date}
                            onChange={(e) => setEditArrivalDate(e.target.value)}
                            required
                        />
                        <input
                            type="datetime-local"
                            placeholder="Edit Departure Date"
                            value={stops.departure_date}
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

