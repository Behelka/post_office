const db = require('../db'); // Import your db connection
const url = require('url');
const parseBody = require('../Parsebody');

const addStopRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const Stop_Package_ID = parsedUrl.pathname.split('/')[3]; // Get the package ID from the path

    if (req.method === 'GET' && parsedUrl.pathname === `/api/Stops/${Stop_Package_ID}`) {
        const infoQuery = `SELECT 
                s.Stop_ID, 
                l.Location_Address_House_Number, 
                l.Location_Address_Street, 
                l.Location_Address_Suffix, 
                l.Location_Address_City, 
                l.Location_Address_State, 
                l.Location_Address_Zip_Code, 
                l.Location_Address_Country, 
                s.Stop_Arrival_Date, 
                s.Stop_Departure_Date
            FROM 
                stop AS s
            JOIN 
                location AS l ON l.Location_ID = s.Stop_Location
            WHERE 
                s.Delete_Stop != 1 
                AND s.Stop_Package_ID = ?`;  

        db.query(infoQuery, [Stop_Package_ID])
            .then(([results]) => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            })
            .catch(error => {
                console.error('Error querying locations:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            });
    } else if (req.method === 'POST' && parsedUrl.pathname === `/api/Stops`) {
        parseBody(req, async (body) => {
            const { location, arrival_date } = body;

            if (!location || !arrival_date) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Location and Arrival Date are required' }));
            }

            const insertQuery = `INSERT INTO stop (Stop_Location, Stop_Arrival_Date, Stop_Package_ID)
                                VALUES (?, ?, ?)`;
            try {
                await db.query(insertQuery, [location, arrival_date, Stop_Package_ID]);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Stop added successfully' }));
            } catch (error) {
                console.error('Error inserting stop:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            }
        });
    } else if (req.method === 'PUT' && parsedUrl.pathname.startsWith('/api/Stops/')) {
        const stopId = parsedUrl.pathname.split('/')[3]; // Get the stop ID from the path

        parseBody(req, async (body) => {
            const { location, arrival_date, departure_date } = body;

            if (!location || !arrival_date) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Location and Arrival Date are required' }));
            }

            const updateQuery = `UPDATE stop 
                                 SET Stop_Location = ?, 
                                     Stop_Arrival_Date = ?, 
                                     Stop_Departure_Date = ? 
                                 WHERE Stop_ID = ?`;

            try {
                await db.query(updateQuery, [location, arrival_date, departure_date || null, stopId]);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Stop updated successfully' }));
            } catch (error) {
                console.error('Error updating stop:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            }
        });
    }
};

module.exports = addStopRoute;
