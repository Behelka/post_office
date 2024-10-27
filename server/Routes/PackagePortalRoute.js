const db = require('../db'); // Import your db connection
const url = require('url');
const parseBody = require('../Parsebody');


const PackagePortalRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const infoQuery = `SELECT 
                            p.Package_ID,
                            p.Sender_ID,
                            p.Recipient_ID,
                            cs.Customer_First_Name AS Sender_First_Name,
                            cs.Customer_Last_Name AS Sender_Last_Name,
                            cr.Customer_First_Name AS Recipient_First_Name,
                            cr.Customer_Last_Name AS Recipient_Last_Name,
                            p.Package_House_Number,
                            p.Package_Street,
                            p.Package_Suffix,
                            p.Package_City,
                            p.Package_State,
                            p.Package_Zip_Code,
                            p.Package_Country,
                            p.Package_Status,
                            p.Package_Length,
                            p.Package_Width,
                            p.Package_Height,
                            p.Package_Weight,
                            p.Package_Shipping_Method,
                            p.Package_Shipping_Cost
                        FROM 
                            package AS p
                        JOIN 
                            customer AS cs ON p.Sender_ID = cs.Customer_ID
                        JOIN 
                            customer AS cr ON p.Recipient_ID = cr.Customer_ID
                        WHERE 
                            p.Delete_Package != 1
                        ORDER BY
                            p.Package_ID;`;
                        

    const validatePackageFields = (body) => {
        const requiredFields = ['sender_id', 'recipient_id', 'packageHouseNumber', 'packageStreet', 'packageSuffix',
            'packageCity', 'packageState', 'packageZipCode', 'packageCountry', 'packageStatus',
            'packageLength', 'packageWidth', 'packageHeight', 'packageWeight', 'packageShippingMethod'];
        for (const field of requiredFields) {
            if (!body[field]) return false;
        }
        return true;
    };

    const CalCost = (packageHeight, packageLength, packageWidth, packageWeight, packageShippingMethod) => {
        const shippingMethodCosts = {
            'Overnight': 15,
            'Air': 7,
            'Ground': 0
        };
        const method = shippingMethodCosts[packageShippingMethod] || 0;

        return cost = Math.ceil(packageLength / 6.0) + Math.ceil(packageWidth / 6.0) +
            Math.ceil(packageHeight / 6.0) + Math.ceil(packageWeight) + method;
    }

    if (req.method === 'GET' && parsedUrl.pathname === '/api/PackagePortal') {
        db.query(infoQuery)
            .then(([results]) => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            })
            .catch(error => {
                console.error('Error querying packages:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            });
    } else if (req.method === 'POST' && parsedUrl.pathname === '/api/PackagePortal') {
        parseBody(req, async (body) => {
            if (!validatePackageFields(body)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'All fields are required' }));
            }

            const { sender_id, recipient_id, packageHouseNumber, packageStreet, packageSuffix,
                packageCity, packageState, packageZipCode, packageCountry, packageStatus,
                packageLength, packageWidth, packageHeight, packageWeight, packageShippingMethod } = body;

            const cost = CalCost(packageHeight, packageLength, packageWidth, packageWeight, packageShippingMethod)

            try {
                const insertQuery = `INSERT INTO package (
                                        Sender_ID, 
                                        Recipient_ID, 
                                        Package_House_Number, 
                                        Package_Street, 
                                        Package_Suffix, 
                                        Package_City, 
                                        Package_State, 
                                        Package_Zip_Code, 
                                        Package_Country, 
                                        Package_Status, 
                                        Package_Length, 
                                        Package_Width, 
                                        Package_Height, 
                                        Package_Weight, 
                                        Package_Shipping_Method, 
                                        Package_Shipping_Cost
                                    ) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

                await db.query(insertQuery, [sender_id, recipient_id, packageHouseNumber, packageStreet,
                    packageSuffix, packageCity, packageState, packageZipCode, packageCountry,
                    packageStatus, packageLength, packageWidth, packageHeight, packageWeight,
                    packageShippingMethod, cost]);

                const [lastPackageQuery] = await db.query(infoQuery);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(lastPackageQuery[0]));
            } catch (error) {
                console.error('Error inserting package:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            }
        });
    } else if (req.method === 'PUT' && parsedUrl.pathname === '/api/PackagePortal') {
        parseBody(req, async (body) => {
            if (!validatePackageFields(body) || !body.package_id) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'All fields are required' }));
            }

            const { package_id, sender_id, recipient_id, packageHouseNumber, packageStreet, packageSuffix,
                packageCity, packageState, packageZipCode, packageCountry, packageStatus,
                packageLength, packageWidth, packageHeight, packageWeight, packageShippingMethod } = body;

            const cost = CalCost(packageHeight, packageLength, packageWidth, packageWeight, packageShippingMethod)

            try {
                const updateQuery = `UPDATE package 
                                    SET Sender_ID = ?, 
                                        Recipient_ID = ?, 
                                        Package_House_Number = ?, 
                                        Package_Street = ?, 
                                        Package_Suffix = ?, 
                                        Package_City = ?, 
                                        Package_State = ?, 
                                        Package_Zip_Code = ?, 
                                        Package_Country = ?, 
                                        Package_Status = ?, 
                                        Package_Length = ?, 
                                        Package_Width = ?, 
                                        Package_Height = ?, 
                                        Package_Weight = ?, 
                                        Package_Shipping_Method = ?,
                                        Package_Shipping_Cost = ?
                                    WHERE Package_ID = ?`;

                await db.query(updateQuery, [sender_id, recipient_id, packageHouseNumber, packageStreet,
                    packageSuffix, packageCity, packageState, packageZipCode, packageCountry,
                    packageStatus, packageLength, packageWidth, packageHeight, packageWeight,
                    packageShippingMethod, cost, package_id]);

                const [updatedPackageQuery] = await db.query(infoQuery);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedPackageQuery[0]));
            } catch (error) {
                console.error('Error updating package:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            }
        });
    } else if (req.method === 'PATCH' && parsedUrl.pathname.startsWith('/api/PackagePortal/')) {
        const Package_ID = parsedUrl.pathname.split('/')[3]; // Get the ID from the URL
        const deleteQuery = `UPDATE package SET Delete_Package = 1 WHERE Package_ID = ?;`;

        db.query(deleteQuery, [Package_ID])
            .then(() => {
                res.writeHead(204); // No content
                res.end();
            })
            .catch(error => {
                console.error('Error deleting package:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
};

module.exports = PackagePortalRoute;