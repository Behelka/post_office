//incomplete
const db = require('../db'); // Import your db connection
const url = require('url');
const parseBody = require('../Parsebody');
const reportsRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET') {
        
        db.query('SELECT * FROM reports', (err, result) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Error fetching reports' }));
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
        });
    } else if (req.method === 'POST') {
        // Handle POST request 
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const parsedBody = parseBody(body); 
            const { title, content } = parsedBody;

            db.query('INSERT INTO reports (title, content) VALUES (?, ?)', [title, content], (err, result) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Error creating report' }));
                    return;
                }
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Report created successfully' }));
            });
        });
    } else {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Method not allowed' }));
    }
};

module.exports = reportsRoute;