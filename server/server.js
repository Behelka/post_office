const http = require('http');
const appRoute = require('./Routes/appRoute'); // Adjust path as necessary

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow your front-end domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Pragma, Cache-Control'); // Allowed headers

    // Handle OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    appRoute(req, res); // Call your route handling function
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
