const db = require('../db');
const url = require('url');

const reportsRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathParts = parsedUrl.pathname.split('/');

    if (req.method === 'GET' && pathParts[2] === 'reports') {
        const reportType = pathParts[3]; // Retrieves the specific report type after /api/Reports/

        let query;
        switch (reportType) {
            case 'employee-department':
                query = 'SELECT * FROM Employee WHERE Delete_Employee != 1';
                break;
            case 'package-delivery':
                query = 'SELECT * FROM Package WHERE Delete_Package != 1';
                break;
            case 'financial-transactions':
                query = 'SELECT * FROM Transactions';
                break;
            default:
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Report type not found' }));
        }

        db.query(query)
            .then(([results]) => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            })
            .catch(error => {
                console.error('Error querying packages:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
};

module.exports = reportsRoute;