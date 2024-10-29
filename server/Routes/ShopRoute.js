const db = require('../db'); // Import database connection
const url = require('url');
const parseBody = require('../Parsebody');

const customerShopRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const validateProductFields = (body) => {
        const requiredFields = ['Product_Name', 'Product_Stock', 'Product_Price'];
        return requiredFields.every(field => body[field]);
    };

    switch (req.method) {
        // Handle GET request to retrieve all products
        case 'GET':
            if (parsedUrl.pathname === '/api/shop') {
                const query = 'SELECT * FROM products WHERE Delete_Product != 1'; // Add a flag for deleted products if needed
                db.query(query)
                    .then(([results]) => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    })
                    .catch(error => {
                        console.error('Error fetching products:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    });
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not Found' }));
            }
            break;

            case 'POST':
                if (parsedUrl.pathname === '/api/shop') {
                    parseBody(req, async (cart) => {
                        try {
                            for (const product of cart) {
                                const transactionId = product.Transaction_ID || null; // Adjust if Transaction_ID is provided or auto-incremented
                                const transactionDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format for MySQL DATETIME
                                
                                await db.query('INSERT INTO transactions (Transaction_ID, Transaction_Date) VALUES (?, ?)', [transactionId, transactionDate]);
                            }
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Payment success' }));
                        } catch (error) {
                            console.error('Error processing checkout:', error);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Checkout failed' }));
                        }
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

module.exports = customerShopRoute;
