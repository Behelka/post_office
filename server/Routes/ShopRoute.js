const db = require('../db'); // Import database connection
const url = require('url');
const parseBody = require('../Parsebody');


const customerShopRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    switch (req.method) {
        // Handle GET request to retrieve all products
        case 'GET':
            // Route for get balance
            if (parsedUrl.pathname === '/api/customer/balance') {
                const customerID = parsedUrl.query.customerID;

                if (!customerID) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Customer ID is required' }));
                    return;
                }

                // Query balance
                const query = 'SELECT Customer_Balance FROM customer WHERE Customer_ID = ?';
                db.query(query, [customerID])
                    .then(([results]) => {
                        if (results.length > 0) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ balance: results[0].Customer_Balance }));
                        } else {
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Customer not found' }));
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching balance:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    });
            }

            else if (parsedUrl.pathname === '/api/shop') {
                const query = 'SELECT * FROM products WHERE Delete_Product != 1'; //  Add a flag for deleted products if needed
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
            } else {// Handle unmatched routes
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not Found' }));
            }
            break;


        case 'POST':
            if (parsedUrl.pathname === '/api/shop') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                const { cart, customerID, totalAmount } = JSON.parse(body);
          
                if (!Array.isArray(cart)) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ message: 'Invalid cart format' }));
                  return;
                }
          
                try {
                  const transactionDate = new Date().toISOString().slice(0, 19).replace('T', ' ');  // Format for MySQL DATETIME
          
                  // Insert transaction record
                  await db.query(
                    'INSERT INTO transactions (Customer_ID, Amount_Deducted, Transaction_Date) VALUES (?, ?, ?)',
                    [customerID, totalAmount, transactionDate]
                  );

                  await db.query(
                    `UPDATE customer SET Customer_Balance=Customer_Balance-? WHERE Customer_ID=?`,
                    [totalAmount,customerID]
                  );

                

          
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
          
    }
};

module.exports = customerShopRoute;
