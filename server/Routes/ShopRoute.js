const db = require('../db'); // Import your db connection
const url = require('url');
const parseBody = require('../Parsebody');
const shopRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

}

module.exports = shopRoute;