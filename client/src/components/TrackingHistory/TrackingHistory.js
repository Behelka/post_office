import React, { useState, useEffect } from "react";
import "./TrackingHistory.css";

const TrackingPage = () => {
    const [trackingID, setTrackingID] = useState('');
    const [trackingData, setTrackingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTrackingData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:3001/api/tracking?trackingId=${trackingID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch tracking data');
            }
            const data = await response.json();
            setTrackingData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (trackingID) {
            fetchTrackingData();
        }
    };

    return (
        <div className="tracking-page-container">
            <h1>Tracking Information</h1>
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="text"
                    value={trackingID}
                    onChange={(e) => setTrackingID(e.target.value)}
                    placeholder="Enter Tracking ID"
                    required
                />
                <button type="submit">Search</button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {trackingData.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Tracking ID</th>
                            <th>Package ID</th>
                            <th>Stop ID</th>
                            <th>Arrival Date</th>
                            <th>Departure Date</th>
                            <th>City</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trackingData.map((entry) => (
                            <tr key={entry.Stop_ID}>
                                <td>{entry.Tracking_ID}</td>
                                <td>{entry.Package_ID}</td>
                                <td>{entry.Stop_ID}</td>
                                <td>{entry.Stop_Arrival_Date}</td>
                                <td>{entry.Stop_Departure_Date}</td>
                                <td>{entry.Location_Address_City}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TrackingPage;
