const db = require('../db'); // Import database connection
const url = require('url');
const parseBody = require('../Parsebody');

const shopRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const validateProductFields = (body) => {
        const requiredFields = ['Product_Name', 'Product_Stock', 'Product_Price'];
        return requiredFields.every(field => body[field]);
    };

    switch (req.method) {
        // Handle GET request to retrieve all products
        case 'GET':
            if (parsedUrl.pathname === '/shop') {
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

        // Handle POST request to create a new product
        case 'POST':
            if (parsedUrl.pathname === '/shop') {
                parseBody(req, async (body) => {
                    if (!validateProductFields(body)) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'All fields are required' }));
                    }

                    const { Product_Name, Product_Stock, Product_Price } = body;
                    const insertQuery = 'INSERT INTO products (Product_Name, Product_Stock, Product_Price) VALUES (?, ?, ?)';

                    try {
                        const [result] = await db.query(insertQuery, [Product_Name, Product_Stock, Product_Price]);
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Product added successfully', productId: result.insertId }));
                    } catch (error) {
                        console.error('Error adding product:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    }
                });
            }
            break;

        // Handle PUT request to update an existing product
        case 'PUT':
            if (parsedUrl.pathname === '/shop') {
                parseBody(req, async (body) => {
                    if (!validateProductFields(body) || !body.Product_ID) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'All fields are required' }));
                    }

                    const { Product_ID, Product_Name, Product_Stock, Product_Price } = body;
                    const updateQuery = 'UPDATE products SET Product_Name = ?, Product_Stock = ?, Product_Price = ? WHERE Product_ID = ?';

                    try {
                        await db.query(updateQuery, [Product_Name, Product_Stock, Product_Price, Product_ID]);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Product updated successfully' }));
                    } catch (error) {
                        console.error('Error updating product:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    }
                });
            }
            break;

        // Handle PATCH request to mark a product as deleted
        case 'PATCH':
            if (parsedUrl.pathname.startsWith('/shop/')) {
                const Product_ID = parsedUrl.pathname.split('/')[2]; // Extract Product_ID from URL
                const deleteQuery = 'UPDATE products SET Delete_Product = 1 WHERE Product_ID = ?'; // Use flag instead of actual deletion if needed

                db.query(deleteQuery, [Product_ID])
                    .then(() => {
                        res.writeHead(204); // No content
                        res.end();
                    })
                    .catch(error => {
                        console.error('Error deleting product:', error);
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

module.exports = shopRoute;
