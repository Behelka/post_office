const db = require('../db');
const url = require('url');

const reportsRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathParts = parsedUrl.pathname.split('/');
    const { startDate, endDate, departmentName } = parsedUrl.query;

    if (req.method === 'GET' && pathParts[2] === 'reports') {
        const reportType = pathParts[3]; // Retrieves the specific report type after /api/reports/
        
        let query;
        let queryParams = [];

        switch (reportType) {
            case 'employee-department':
                query = `SELECT employee.*, departments.Department_Name 
                        FROM employee JOIN departments ON employee.Employee_Department_ID = departments.Department_ID 
                        WHERE employee.Delete_Employee != 1`;
                 if (departmentName) {
                    query += ' AND departments.Department_Name = ?';
                    queryParams.push(departmentName);
                } 
                break;

            case 'package-delivery':
                query = 'SELECT * FROM Package'
                /* `SELECT p.*, s.*, l.* 
                        FROM Package AS p, Stop AS s, Location AS l 
                        WHERE p.Package_ID = s.Stop_Package_ID AND s.Stop_Location = l.Location_ID AND p.Delete_Package != 1` */;
                break;

            case 'financial-transactions':
                query = 'SELECT * FROM Transactions';

                // Apply date filtering if startDate and endDate are provided
                if (startDate && endDate) {
                    query += ' WHERE Transaction_Date BETWEEN ? AND ?';
                    queryParams = [startDate, endDate];
                }
                break;

            default:
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Report type not found' }));
        }

        db.query(query, queryParams)
            .then(([results]) => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            })
            .catch(error => {
                console.error('Error querying data:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
};

module.exports = reportsRoute;
