import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Stops = () => {
    const { packageId } = useParams();
    const [stops, setStops] = useState([]);
    const [location, setLocation] = useState("");
    const [arrivalDate, setArrivalDate] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [editingStop, setEditingStop] = useState(null);

    const formatStopItem = (item) => ({
        stop_id: item.Stop_ID,
        stop_location: `${item.Location_Address_House_Number} ${item.Location_Address_Street} ${item.Location_Address_Suffix || ''}, ${item.Location_Address_City}, 
                        ${item.Location_Address_State} ${item.Location_Address_Zip_Code}, ${item.Location_Address_Country}`,
        arrival_date: formatDate(item.Stop_Arrival_Date),
        departure_date: item.Stop_Departure_Date ? formatDate(item.Stop_Departure_Date) : "Not Departed",
    });

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

    const fetchStops = async (packageId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/Stops/${packageId}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            const formattedData = result.map(formatStopItem);
            setStops(formattedData);
        } catch (error) {
            console.error('Error fetching stops:', error);
        }
    };

    useEffect(() => {
        fetchStops(packageId);
    }, [packageId]);

    const handleAddStop = async (e) => {
        e.preventDefault();
        const newStop = { 
            location, 
            arrival_date: arrivalDate, 
            Stop_Package_ID: packageId // Pass packageId here
        };
    
        try {
            const response = await fetch(`http://localhost:3001/api/Stops`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newStop),
            });
    
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            setStops((prev) => [...prev, formatStopItem(result)]);
            setLocation(""); 
            setArrivalDate(""); 
        } catch (error) {
            console.error("Error adding stop:", error);
        }
    };
    
    const handleEditStop = async () => {
        if (!editingStop) return;
    
        try {
            const response = await fetch(`http://localhost:3001/api/Stops/${editingStop.stop_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingStop),
            });
    
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const updatedStop = await response.json();
            setStops((prev) => prev.map((stop) => (stop.stop_id === updatedStop.Stop_ID ? formatStopItem(updatedStop) : stop)));
            setEditingStop(null);
        } catch (error) {
            console.error("Error updating stop:", error);
        }
    };

    const handleDeleteStop = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/Stops/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            setStops((prev) => prev.filter((stop) => stop.stop_id !== id));
        } catch (error) {
            console.error("Error deleting stop:", error);
        }
    };

    return (
        <div>
            <h2>Stops for Package ID: {packageId}</h2>
            <form onSubmit={handleAddStop}>
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <input
                    type="date"
                    placeholder="Arrival Date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    required
                />
                <button type="submit">Add Stop</button>
            </form>

            <h3>Current Stops</h3>
            {stops.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Stop ID</th>
                            <th>Location</th>
                            <th>Arrival Date</th>
                            <th>Departure Date</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stops.map((stop) => (
                            <tr key={stop.stop_id}>
                                <td onClick={() => setEditingStop(stop)} style={{ cursor: 'pointer', color: 'blue' }}>
                                    {stop.stop_id}
                                </td>
                                <td>{stop.stop_location}</td>
                                <td>{stop.arrival_date}</td>
                                <td>{stop.departure_date}</td>
                                <td>
                                    <button onClick={() => handleDeleteStop(stop.stop_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No stops available</p>
            )}

            {editingStop && (
                <div>
                    <h3>Edit Stop ID: {editingStop.stop_id}</h3>
                    <form onSubmit={handleEditStop}>
                        <input
                            type="text"
                            value={editingStop.stop_location}
                            onChange={(e) => setEditingStop({ ...editingStop, stop_location: e.target.value })}
                            required
                        />
                        <input
                            type="date"
                            value={editingStop.arrival_date.split(' ')[0]} // Get the date part
                            onChange={(e) => setEditingStop({ ...editingStop, arrival_date: e.target.value })}
                            required
                        />
                        <input
                            type="date"
                            value={editingStop.departure_date === "Not Departed" ? "" : editingStop.departure_date.split(' ')[0]}
                            onChange={(e) => setEditingStop({ ...editingStop, departure_date: e.target.value })}
                        />
                        <button type="submit">Update Stop</button>
                        <button type="button" onClick={() => setEditingStop(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Stops;