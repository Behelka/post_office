const db = require('../db'); // Import your db connection
const url = require('url');
const parseBody = require('../Parsebody');

const addLocationRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    switch (req.method) {
        case 'GET':
            if (parsedUrl.pathname === '/api/location') {
                const query = `SELECT * FROM location WHERE Delete_Location != 1;`;
                db.query(query)
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
            if (parsedUrl.pathname === '/api/location') {
                parseBody(req, async (body) => {
                    const { houseNumber, street, suffix, city, state, zipCode, country } = body;

                    // Validate required fields
                    if (!houseNumber || !street || !city || !state || !zipCode || !country) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'All address fields are required' }));
                    }

                    try {
                        const insertQuery = `INSERT INTO location (Location_Address_House_Number, Location_Address_Street, Location_Address_Suffix, Location_Address_City, Location_Address_State, Location_Address_Zip_Code, Location_Address_Country) VALUES (?, ?, ?, ?, ?, ?, ?);`;
                        await db.query(insertQuery, [houseNumber, street, suffix, city, state, zipCode, country]);

                        const [lastLocationQuery] = await db.query(`SELECT * FROM location WHERE Location_ID = LAST_INSERT_ID();`);
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(lastLocationQuery[0]));
                    } catch (error) {
                        console.error('Error inserting location:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    }
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not Found' }));
            }
            break;

        case 'PUT':
            if (parsedUrl.pathname.startsWith('/api/location/')) {
                const Location_ID = parsedUrl.pathname.split('/')[3]; // Get the ID from the URL
                parseBody(req, async (body) => {
                    const { houseNumber, street, suffix, city, state, zipCode, country } = body;

                    // Validate required fields
                    if (!houseNumber || !street || !city || !state || !zipCode || !country) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'All address fields are required' }));
                    }

                    try {
                        const updateQuery = `UPDATE location SET Location_Address_House_Number = ?, Location_Address_Street = ?, Location_Address_Suffix = ?, Location_Address_City = ?, Location_Address_State = ?, Location_Address_Zip_Code = ?, Location_Address_Country = ? WHERE Location_ID = ?;`;
                        await db.query(updateQuery, [houseNumber, street, suffix, city, state, zipCode, country, Location_ID]);

                        const [updatedLocationQuery] = await db.query(`SELECT * FROM location WHERE Location_ID = ?;`, [Location_ID]);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(updatedLocationQuery[0]));
                    } catch (error) {
                        console.error('Error updating location:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    }
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not Found' }));
            }
            break;

        case 'PATCH':
            if (parsedUrl.pathname.startsWith('/api/location/')) {
                const Location_ID = parsedUrl.pathname.split('/')[3]; // Get the ID from the URL
                const deleteQuery = `UPDATE location SET Delete_Location = 1 WHERE Location_ID = ?;`;
                db.query(deleteQuery, [Location_ID])
                    .then(() => {
                        res.writeHead(204);
                        res.end();
                    })
                    .catch(error => {
                        console.error('Error deleting location:', error);
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

module.exports = addLocationRoute;
