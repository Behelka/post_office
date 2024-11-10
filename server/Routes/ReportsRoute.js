const db = require('../db');
const url = require('url');

const reportsRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathParts = parsedUrl.pathname.split('/');
    const { startDate, endDate, productType, customerName, status, deliveryMethod } = parsedUrl.query;

    if (req.method === 'GET' && pathParts[2] === 'reports') {
        const reportType = pathParts[3]; // Retrieves the specific report type after /api/reports/
        
        let query;
        let queryParams = [];

        switch (reportType) {
            case 'inventory':
                query = `SELECT p.*  
                        FROM Products AS p
                        WHERE p.Delete_Product != 1`;
                 if (productType) {
                    query += ' AND p.Product_Name = ?';
                    queryParams.push(productType);
                } 
                break;
        
            case 'package-delivery':
                query = `SELECT p.*, th.* 
                        FROM Package AS p, Tracking_history AS th 
                        WHERE p.Package_ID = th.Package_ID AND p.Delete_Package != 1` ;

                //date filter
                if (startDate && endDate) {
                    query += ' AND ((th.Arrival_Date BETWEEN ? AND ?) OR (th.Departure_Date BETWEEN ? AND ?))';
                    queryParams.push(startDate, endDate, startDate, endDate);
                }

                //package status filter
                if (status) {
                    query += ' AND p.Package_Status = ?';
                    queryParams.push(status);
                }  

                if (deliveryMethod) {
                    query += ' AND p.Package_Shipping_Method = ?';
                    queryParams.push(deliveryMethod);
                }  
                break;
            
            case 'financial-transactions':
                query = `
                    SELECT t.*, p.*, c.*
                    FROM Transactions AS t
                    JOIN Products AS p ON t.Product_ID = p.Product_ID
                    JOIN Customer AS c ON t.Customer_ID = c.Customer_ID
                `;

                // date range filtering
                if (startDate && endDate) {
                    query += ' WHERE t.Transaction_Date BETWEEN ? AND ?';
                    queryParams.push(startDate, endDate);
                }
            
                // product type filter
                if (productType) {
                    query += (queryParams.length ? ' AND' : ' WHERE') + ' p.Product_Name = ?';
                    queryParams.push(productType);
                }
            
                // customer name filter
                  if (customerName) {
                    query += (queryParams.length ? ' AND' : ' WHERE') + 
                                ` (c.Customer_First_Name LIKE ? OR c.Customer_Last_Name LIKE ?)`;
                    queryParams.push(`%${customerName}%`, `%${customerName}%`);
                } 
            
                // sorting by transaction date
                query += ' ORDER BY t.Transaction_Date';

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
