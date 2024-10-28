const url = require('url');
const handleLocationRoutes = require('./AddLocationRoute'); // Adjust the path as necessary
const handleCustomerRoutes = require('./CustomerProfileRoute'); // Add other routes as necessary
const handlePackagePortalRoutes = require('./PackagePortalRoute');
const handleStopRoutes = require('./StopRoute');
const handleTrackingRoutes = require('./TrackingHistoryRoute');

const handleReportRoutes = require('./ReportsRoute')
const handleShopRoutes = require('./EmployeeShopRoute')

const appRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;

    // Route handling
    if (parsedUrl.pathname.startsWith('/api/location')) {
        handleLocationRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith('/api/customer')) {
        handleCustomerRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith('/api/PackagePortal')){
        handlePackagePortalRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith('/api/Stops')) {
        handleStopRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith('/api/tracking')) {
        handleTrackingRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith('/api/reports')) {
        handleReportRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith('/shop')) {
        handleShopRoutes(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    } 
};

module.exports = appRoute;
