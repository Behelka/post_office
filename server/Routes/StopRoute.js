const db = require('../db'); // Import your db connection
const url = require('url');
const parseBody = require('../Parsebody');

const addStopRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const Stop_Package_ID = parsedUrl.pathname.split('/')[2]; // Get the package ID from the path

    switch (req.method) {
        case 'GET':
            if (parsedUrl.pathname === `/Stops/${Stop_Package_ID}`) {
                const infoQuery = `
                    SELECT 
                        s.Stop_ID, 
                        l.Location_ID,  -- Add this line to select the Location_ID
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
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not Found' }));
            }
            break;

        case 'POST':
            if (parsedUrl.pathname.startsWith('/Stops/')) {
                const Stop_Package_ID = parsedUrl.pathname.split('/')[2];
                parseBody(req, (body) => {
                    const { location, arrival_date, departure_date } = body;

                    if (!location || !arrival_date) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'Location and Arrival Date are required' }));
                    }

                    const insertQuery = `
                        INSERT INTO stop (Stop_Location, Stop_Arrival_Date, Stop_Departure_Date, Stop_Package_ID)
                        VALUES (?, ?, ?, ?)`;

                    db.query(insertQuery, [location, arrival_date, departure_date || null, Stop_Package_ID])
                        .then(([result]) => {
                            // Return the newly added stop with its ID
                            const newStop = {
                                Stop_ID: result.insertId,
                                Stop_Location: location,
                                Stop_Arrival_Date: arrival_date,
                                Stop_Departure_Date: departure_date,
                                Stop_Package_ID: Stop_Package_ID
                            };
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(newStop));
                        })
                        .catch(error => {
                            console.error('Error inserting stop:', error);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Internal Server Error' }));
                        });
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not Found' }));
            }
            break;

            case 'PUT':
                if (parsedUrl.pathname.startsWith('/Stops/')) {
                    const Stop_ID = parsedUrl.pathname.split('/')[2];
                    parseBody(req, (body) => {
                        const { arrival_date, departure_date, location } = body;
            
                        const formattimezone = (date) => {
                            const localDate = new Date(date);

                            // Check if the input date is in UTC (optional: adjust this logic as needed)
                            if (localDate.getTimezoneOffset() === 0) {
                                // Input is UTC, do not adjust
                                return localDate.toISOString().slice(0, 19).replace('T', ' ');
                            }

                            // Otherwise, adjust to CST (or desired timezone)
                            localDate.setHours(localDate.getHours() - localDate.getTimezoneOffset() / 60);
                            return localDate.toISOString().slice(0, 19).replace('T', ' ');
                        };
            
                        const formattedArrivalDate = formattimezone(arrival_date);
                        const formattedDepartureDate = departure_date ? formattimezone(departure_date) : null;
            
                        // Validate input
                        if (!arrival_date || !location) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ message: 'Arrival Date and Location are required' }));
                        }
            
                        const updateQuery = 
                            `UPDATE stop 
                            SET
                                Stop_Arrival_Date = ?, 
                                Stop_Departure_Date = ?, 
                                Stop_Location = ? 
                            WHERE Stop_ID = ?;`;
            
                        db.query(updateQuery, [formattedArrivalDate, formattedDepartureDate, location, Stop_ID])
                            .then(() => {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: 'Stop updated successfully' }));
                            })
                            .catch(error => {
                                console.error('Error updating stop:', error);
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: 'Internal Server Error' }));
                            });
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Not Found' }));
                }
                break;

        case 'PATCH':
            if (parsedUrl.pathname.startsWith('/Stops/')) {
                const Stop_ID = parsedUrl.pathname.split('/')[2];
                const deleteQuery = `
                    UPDATE stop SET Delete_Stop = 1 WHERE Stop_ID = ?`;
                
                db.query(deleteQuery, [Stop_ID])
                    .then(() => {
                        res.writeHead(204); // No content
                        res.end();
                    })
                    .catch(error => {
                        console.error('Error deleting stop:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    });
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not Found' }));
            }
            break;

        default:
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Method Not Allowed' }));
            break;
    }
};

module.exports = addStopRoute;