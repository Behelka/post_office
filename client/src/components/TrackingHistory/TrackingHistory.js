import React, { useState, useEffect } from "react";
import "./TrackingHistory.css";
import { useLocation } from "react-router-dom";

const TrackingPage = () => {
    const [trackingID, setTrackingID] = useState('');
    const [searchedTrackingID, setSearchedTrackingID] = useState('');
    const [trackingData, setTrackingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get("trackingId");
        if (id) {
            setTrackingID(id);
            fetchTrackingData(id);
        }
    }, [location]);

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true, 
        };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    const fetchTrackingData = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3001/api/tracking?trackingId=${id}`);
            if (!response.ok) {
                throw new Error('No data found for this Tracking ID');
            }
            const data = await response.json();
            setTrackingData(data);
            setSearchedTrackingID(id);
        } catch (err) {
            console.error(err);
            setTrackingData([]);
            setSearchedTrackingID('');
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (trackingID) {
            fetchTrackingData(trackingID);
            setTrackingID("");
        }
    };

    const latestStatus = trackingData.length > 0 
        ? trackingData[trackingData.length - 1].Package_Status 
        : "No Status Available";

    return (
        <div className="th_main_div">
            <h1 className="h">Track Package</h1>
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    className="input"
                    type="text"
                    value={trackingID}
                    onChange={(e) => setTrackingID(e.target.value)}
                    placeholder="Enter Tracking ID"
                    required
                />
                <button type="submit" className="th_searchButton">Track</button>
            </form>


            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {trackingData.length > 0 && (
                <div>
                    <h2 className="h2">Tracking ID: {searchedTrackingID}</h2>
                    <h3 className="h2">Status: {latestStatus}</h3>
                    <table>
                        <tbody>
                            {trackingData.map((entry, index) => (
                                <React.Fragment key={entry.Stop_ID}>
                                    <tr>
                                        <td>{formatDate(entry.Stop_Arrival_Date)}</td>
                                        <td>Arrive</td>
                                        <td rowSpan={entry.Stop_Departure_Date ? 2 : 1}>
                                            {`${entry.Location_Address_City}, ${entry.Location_Address_State} ${entry.Location_Address_Country}`}
                                        </td>
                                    </tr>
                                    {entry.Stop_Departure_Date && (
                                        <tr>
                                            <td>{formatDate(entry.Stop_Departure_Date)}</td>
                                            <td>Out of</td>
                                        </tr>
                                    )}
                                    {index < trackingData.length - 1 && (
                                        <tr>
                                            <td colSpan="3">
                                                <div className="dotted-line"></div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TrackingPage;
