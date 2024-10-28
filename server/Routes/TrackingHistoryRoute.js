const db = require('../db');
const url = require('url');

const TrackingRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const trackingId = parsedUrl.query.trackingId;

    if (req.method === 'GET' && parsedUrl.pathname === '/api/tracking') {
        if (!trackingId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Tracking ID is required' }));
        }

        const query = `
            SELECT 
                th.Tracking_ID, 
                th.Package_ID, 
                s.Stop_ID, 
                s.Stop_Arrival_Date, 
                s.Stop_Departure_Date, 
                l.Location_Address_City
            FROM 
                tracking_history th
            JOIN 
                stop s ON th.Package_ID = s.Stop_Package_ID
            JOIN 
                location l ON s.Stop_Location = l.Location_ID
            WHERE 
                th.Tracking_ID = ?;
        `;

        db.query(query, [trackingId])
            .then(([results]) => {
                if (results.length > 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(results));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'No data found for this Tracking ID' }));
                }
            })
            .catch(error => {
                console.error('Error querying tracking data:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
};

module.exports = TrackingRoute;
