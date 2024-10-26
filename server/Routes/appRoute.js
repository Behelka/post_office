const url = require('url');
const handleLocationRoutes = require('./AddLocationRoute'); // Adjust the path as necessary
const handleCustomerRoutes = require('./CustomerProfileRoute'); // Add other routes as necessary
const handleReportRoutes = require('./ReportsRoute')

const appRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;

    // Route handling
    if (parsedUrl.pathname.startsWith('/api/location')) {
        handleLocationRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith('/api/customer')) {
        handleCustomerRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith('/api/reports')) {
        handleReportRoutes(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
};

module.exports = appRoute;
