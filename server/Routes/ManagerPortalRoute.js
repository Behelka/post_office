const db = require('../db'); // Import your db connection
const url = require('url');
const parseBody = require('../Parsebody');

const ManagerPortalRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const Department_Manager_ID = parsedUrl.pathname.split('/')[3]; 

    switch (req.method) {
        case 'GET':
            if (parsedUrl.pathname.startsWith('/api/ManagerPortal')) {
                const query = `
                    SELECT 
                        e.Employee_ID,
                        e.First_Name,
                        e.Middle_Name,
                        e.Last_Name,
                        e.Phone_Number,
                        e.Email,
                        DATE_FORMAT(e.DOB, '%m-%d-%Y') AS DOB,
                        l.Location_Address_House_Number,
                        l.Location_Address_Street,
                        l.Location_Address_Suffix,
                        l.Location_Address_City,
                        l.Location_Address_State,
                        l.Location_Address_Zip_Code,
                        l.Location_Address_Country,
                        d.Department_ID,
                        d.Department_Location_ID
                    FROM 
                        employee AS e
                    JOIN 
                        departments AS d ON e.Employee_Manager_ID = d.Department_Manager_ID
                    JOIN 
                        location AS l ON d.Department_Location_ID = l.Location_ID
                    WHERE 
                        e.Delete_Employee = FALSE
                        AND d.Department_Manager_ID = ?
                        AND e.Employee_ID != d.Department_Manager_ID;`;
                db.query(query, [Department_Manager_ID])
                    .then(([results]) => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    })
                    .catch(error => {
                        console.error('Error querying employees:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    });
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not Found' }));
            }
            break;

            case 'POST':
                if (parsedUrl.pathname === '/api/ManagerPortal') {
                    parseBody(req, async (body) => {
                        const { firstName, middleName, lastName, phoneNumber, email, locationId, departmentId, managerID, dateOfBirth } = body;
                        const password = "Temp123";
                        // Validate required fields
                        if (!firstName || !middleName || !lastName || !phoneNumber || !email || !dateOfBirth) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ message: 'All fields are required including Date of Birth' }));
                        }

                        try {
                            // Insert employee data into the employee table, including Date_Of_Birth
                            const insertQuery = `
                                INSERT INTO employee (First_Name, Middle_Name, Last_Name, Phone_Number, Email, Employee_Location_ID, Employee_Department_ID, Employee_Manager_ID, DOB, Password)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                            `;
                            await db.query(insertQuery, [firstName, middleName, lastName, phoneNumber, email, locationId, departmentId, managerID, dateOfBirth, password]);

                            const [lastEmployeeQuery] = await db.query('SELECT * FROM employee WHERE Employee_ID = LAST_INSERT_ID()');
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(lastEmployeeQuery[0]));
                        } catch (error) {
                            console.error('Error inserting employee:', error);
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
                if (parsedUrl.pathname.startsWith('/api/ManagerPortal')) {
                    const Employee_ID = parsedUrl.pathname.split('/')[3];
                    parseBody(req, async (body) => {
                        const { firstName, middleName, lastName, phoneNumber, email, dateOfBirth } = body;

                        // Validate required fields
                        if (!firstName || !middleName || !lastName || !phoneNumber || !email || !dateOfBirth) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ message: 'All address fields are required' }));
                        }

                        try {
                            const updateQuery = `UPDATE employee SET First_Name = ?, Middle_Name = ?, Last_Name = ?, Phone_Number = ?, Email = ?, DOB = ? WHERE Employee_ID = ?;`;
                            await db.query(updateQuery, [firstName, middleName, lastName, phoneNumber, email, dateOfBirth, Employee_ID]);

                            const [updatedLocationQuery] = await db.query(`SELECT * FROM employee WHERE Employee_ID = ?;`, [Employee_ID]);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(updatedLocationQuery[0]));
                        } catch (error) {
                            console.error('Error updating employee:', error);
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
                if (parsedUrl.pathname.startsWith('/api/ManagerPortal')) {
                    const Employee_ID = parsedUrl.pathname.split('/')[3]; // Get the ID from the URL
                    const deleteQuery = `UPDATE employee SET Delete_Employee = 1 WHERE Employee_ID = ?;`;
                    db.query(deleteQuery, [Employee_ID])
                        .then(() => {
                            res.writeHead(204);
                            res.end();
                        })
                        .catch(error => {
                            console.error('Error deleting employee:', error);
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
    }
};

module.exports = ManagerPortalRoute;