const url = require("url");
const handleLocationRoutes = require("./AddLocationRoute"); // Adjust the path as necessary
const handleCustomerRoutes = require("./CustomerProfileRoute"); // Add other routes as necessary
const handleLoginRoutes = require("./LoginRoute"); // Add other routes as necessary
const handlePackagePortalRoutes = require("./PackagePortalRoute");
const handleStopRoutes = require("./StopRoute");
const handleTrackingRoutes = require("./TrackingHistoryRoute");
const handleReportRoutes = require("./ReportsRoute");
const handleEmployeeShopRoutes = require("./EmployeeShopRoute");
const handleCustomerShopRoutes = require("./ShopRoute");
const handleReportsRoute = require('./ReportsRoute');
const handleShopRoute = require('./ShopRoute');
const handleDepartmentRoute = require('./AddDepartmentRoute');
const handleEmployeeRoutes = require("./EmployeeProfileRoute");

const appRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;


    // Route handling
    if (parsedUrl.pathname.startsWith("/api/location")) {
        handleLocationRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/customer")) {
        handleCustomerRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/login")) {
        handleLoginRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/PackagePortal")) {
        handlePackagePortalRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/Stops")) {
        handleStopRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith('/api/Reports')) {
        handleReportsRoute(req, res);
    } else if (parsedUrl.pathname.startsWith('/shop')) {
        handleShopRoute(req, res);
    } else if (parsedUrl.pathname.startsWith('/departments')) {
        handleDepartmentRoute(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/tracking")) {
        handleTrackingRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/reports")) {
        handleReportRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/shop")) {
        handleEmployeeShopRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/shop")) {
        handleCustomerShopRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/api/employee")) {
        handleEmployeeRoutes(req, res);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Not Found" }));
    }

};

module.exports = appRoute;

appRoute.js 
