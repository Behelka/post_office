const db = require('../db'); // Import your db connection
const url = require('url');
const parseBody = require('../Parsebody');

const addDepartmentsRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    switch (req.method) {
        case 'GET':
            if (parsedUrl.pathname === '/departments') {
                const query = `SELECT * FROM departments WHERE Delete_Department != 1;`;
                db.query(query)
                    .then(([results]) => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    })
                    .catch(error => {
                        console.error('Error querying departments:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    });
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not Found' }));
            }
            break;

        case 'POST':
            if (parsedUrl.pathname === '/departments') {
                parseBody(req, async (body) => {
                    const { departmentName, departmentManager, departmentLocation } = body;

                    // Validate required fields
                    if (!departmentName || !departmentManager || !departmentLocation) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'All department fields are required' }));
                    }

                    try {
                        const insertQuery = `
                            INSERT INTO departments 
                            (Department_Name, Department_Manager, Department_Location, Delete_Department) 
                            VALUES (?, ?, ?, 0);
                        `;
                        await db.query(insertQuery, [departmentName, departmentManager, departmentLocation]);

                        const [lastDepartmentQuery] = await db.query(`SELECT * FROM department WHERE Department_ID = LAST_INSERT_ID();`);
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(lastDepartmentQuery[0]));
                    } catch (error) {
                        console.error('Error inserting department:', error);
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
            if (parsedUrl.pathname.startsWith('/departments/')) {
                const departmentId = parsedUrl.pathname.split('/')[2]; // Extract the department ID from the URL
                parseBody(req, async (body) => {
                    const { departmentName, departmentManager, departmentLocation } = body;

                    // Validate required fields
                    if (!departmentName || !departmentManager || !departmentLocation) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'All department fields are required' }));
                    }

                    try {
                        const updateQuery = `
                            UPDATE departments 
                            SET Department_Name = ?, Department_Manager = ?, Department_Location = ? 
                            WHERE Department_ID = ? AND Delete_Department != 1;
                        `;
                        await db.query(updateQuery, [departmentName, departmentManager, departmentLocation, departmentId]);

                        const [updatedDepartmentQuery] = await db.query(`SELECT * FROM department WHERE Department_ID = ?;`, [departmentId]);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(updatedDepartmentQuery[0]));
                    } catch (error) {
                        console.error('Error updating department:', error);
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
            if (parsedUrl.pathname.startsWith('/departments/')) {
                const departmentId = parsedUrl.pathname.split('/')[2]; // Extract the department ID from the URL
                const deleteQuery = `UPDATE department SET Delete_Department = 1 WHERE Department_ID = ?;`;
                db.query(deleteQuery, [departmentId])
                    .then(() => {
                        res.writeHead(204);
                        res.end();
                    })
                    .catch(error => {
                        console.error('Error deleting department:', error);
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

module.exports = addDepartmentsRoute;
