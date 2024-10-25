const db = require('../db'); // Import your db connection
const url = require('url');

const parseBody = require('../Parsebody'); 

const reportsRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    if (req.method === 'GET' && parsedUrl.pathname === '/api/reports'){
      const Query =  `SELECT *
                      FROM package`;
          db.query(Query)
          .then(([results]) => {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(results));
          })
          .catch(error => {
              console.error('Error querying locations:', error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Internal Server Error' }));
          });
  }

    if (path.startsWith('/api/reports') && req.method === 'POST') {
        // Parse JSON body
        parseBody(req, (body) => {
            const { reportType } = body;
            
            // Handle invalid or missing report type
            if (!reportType) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Report type is required' }));
                return;
            }

            let query = '';
            if (reportType === 'employee-department') {
                query = 'SELECT * FROM Employee';
            } else if (reportType === 'package-delivery') {
                query = 'SELECT * FROM Package';
            } else if (reportType === 'financial-transactions') {
                query = 'SELECT * FROM Package';
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid report type' }));
                return;
            }

            db.query(query, (error, results) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Database query failed' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(results));
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
};

module.exports = reportsRoute;

