const db = require('../db'); // Import database connection
const url = require('url');
const parseBody = require('../Parsebody');

const PackagePortalRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // SQL query to retrieve package information
    const infoQuery = `
        SELECT 
            p.Package_ID, p.Sender_ID, p.Recipient_ID,
            cs.Customer_First_Name AS Sender_First_Name,
            cs.Customer_Last_Name AS Sender_Last_Name,
            cr.Customer_First_Name AS Recipient_First_Name,
            cr.Customer_Last_Name AS Recipient_Last_Name,
            p.Package_House_Number, p.Package_Street, p.Package_Suffix,
            p.Package_City, p.Package_State, p.Package_Zip_Code,
            p.Package_Country, p.Package_Status, p.Package_Length,
            p.Package_Width, p.Package_Height, p.Package_Weight,
            p.Package_Shipping_Method, p.Package_Shipping_Cost
        FROM 
            package AS p
        JOIN 
            customer AS cs ON p.Sender_ID = cs.Customer_ID
        JOIN 
            customer AS cr ON p.Recipient_ID = cr.Customer_ID
        WHERE 
            p.Delete_Package != 1
        ORDER BY 
            p.Package_ID;
    `;

    const validatePackageFields = (body) => {
        const requiredFields = [
            'sender_id', 'recipient_id', 'packageHouseNumber', 'packageStreet',
            'packageSuffix', 'packageCity', 'packageState', 'packageZipCode',
            'packageCountry', 'packageStatus', 'packageLength', 'packageWidth',
            'packageHeight', 'packageWeight', 'packageShippingMethod'
        ];
        return requiredFields.every(field => body[field]);
    };

    const CalCost = (packageHeight, packageLength, packageWidth, packageWeight, packageShippingMethod) => {
        const shippingMethodCosts = { 'Overnight': 15, 'Air': 7, 'Ground': 0 };
        const methodCost = shippingMethodCosts[packageShippingMethod] || 0;
        return Math.ceil(packageLength / 6) + Math.ceil(packageWidth / 6) +
               Math.ceil(packageHeight / 6) + Math.ceil(packageWeight) + methodCost;
    };

    switch (req.method) {
        // Handle GET request to retrieve all packages
        case 'GET':
            if (parsedUrl.pathname === '/api/PackagePortal') {
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
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not Found' }));
            }
            break;

        // Handle POST request to create a new package
        case 'POST':
            if (parsedUrl.pathname === '/api/PackagePortal') {
                parseBody(req, async (body) => {
                    if (!validatePackageFields(body)) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'All fields are required' }));
                    }

                    const { sender_id, recipient_id, packageHouseNumber, packageStreet, packageSuffix,
                            packageCity, packageState, packageZipCode, packageCountry, packageStatus,
                            packageLength, packageWidth, packageHeight, packageWeight, packageShippingMethod } = body;

                    const cost = CalCost(packageHeight, packageLength, packageWidth, packageWeight, packageShippingMethod);

                    try {
                        const insertQuery = `
                            INSERT INTO package (
                                Sender_ID, Recipient_ID, Package_House_Number, Package_Street, 
                                Package_Suffix, Package_City, Package_State, Package_Zip_Code, 
                                Package_Country, Package_Status, Package_Length, Package_Width, 
                                Package_Height, Package_Weight, Package_Shipping_Method, Package_Shipping_Cost
                            ) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                        `;

                        await db.query(insertQuery, [
                            sender_id, recipient_id, packageHouseNumber, packageStreet,
                            packageSuffix, packageCity, packageState, packageZipCode,
                            packageCountry, packageStatus, packageLength, packageWidth,
                            packageHeight, packageWeight, packageShippingMethod, cost
                        ]);

                        const [lastPackageQuery] = await db.query(infoQuery);
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(lastPackageQuery[0]));
                    } catch (error) {
                        console.error('Error inserting package:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    }
                });
            }
            break;

        // Handle PUT request to update an existing package
        case 'PUT':
            if (parsedUrl.pathname === '/api/PackagePortal') {
                parseBody(req, async (body) => {
                    if (!validatePackageFields(body) || !body.package_id) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'All fields are required' }));
                    }

                    const { package_id, sender_id, recipient_id, packageHouseNumber, packageStreet, packageSuffix,
                            packageCity, packageState, packageZipCode, packageCountry, packageStatus,
                            packageLength, packageWidth, packageHeight, packageWeight, packageShippingMethod } = body;

                    const cost = CalCost(packageHeight, packageLength, packageWidth, packageWeight, packageShippingMethod);

                    try {
                        const updateQuery = `
                            UPDATE package 
                            SET 
                                Sender_ID = ?, Recipient_ID = ?, Package_House_Number = ?, Package_Street = ?, 
                                Package_Suffix = ?, Package_City = ?, Package_State = ?, Package_Zip_Code = ?, 
                                Package_Country = ?, Package_Status = ?, Package_Length = ?, Package_Width = ?, 
                                Package_Height = ?, Package_Weight = ?, Package_Shipping_Method = ?, Package_Shipping_Cost = ?
                            WHERE 
                                Package_ID = ?;
                        `;

                        await db.query(updateQuery, [
                            sender_id, recipient_id, packageHouseNumber, packageStreet,
                            packageSuffix, packageCity, packageState, packageZipCode,
                            packageCountry, packageStatus, packageLength, packageWidth,
                            packageHeight, packageWeight, packageShippingMethod, cost, package_id
                        ]);

                        const [updatedPackageQuery] = await db.query(infoQuery);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(updatedPackageQuery[0]));
                    } catch (error) {
                        console.error('Error updating package:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    }
                });
            }
            break;

        // Handle PATCH request to mark a package as deleted
        case 'PATCH':
            if (parsedUrl.pathname.startsWith('/api/PackagePortal/')) {
                const Package_ID = parsedUrl.pathname.split('/')[3]; // Extract Package_ID from URL
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
            }
            break;

        // Handle unmatched routes
        default:
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Not Found' }));
            break;
    }
};

module.exports = PackagePortalRoute;
