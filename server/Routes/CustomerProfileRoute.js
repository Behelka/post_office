//doesn't work yet
const db = require('../db'); // Import database connection
const parseBody = require('../Parsebody'); // Import body parser

module.exports = (req, res, path, method) => {
    // GET customer profile
    if (method === 'GET' && path === 'api/customer') {
        db.query('SELECT * FROM customer WHERE Delete_Customer != 1', (err, result) => {
            if (err) {
                console.error('Error fetching customer data:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error fetching customer data' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result)); // Send all customers instead of just the first
            }
        });
    } 
    // PUT to update customer profile
    else if (method === 'PUT' && path.startsWith('api/customer/')) {
        const customerId = path.split('/').pop(); // Extract customer ID from URL

        parseBody(req, (body) => {
            const query = `
                UPDATE customer
                SET 
                    Customer_First_Name = ?, Customer_Middle_Name = ?, Customer_Last_Name = ?,
                    Customer_Email_Address = ?, Customer_Phone_Number = ?, 
                    Customer_Address_House_Number = ?, Customer_Address_Street = ?, 
                    Customer_Address_Suffix = ?, Customer_Address_City = ?, 
                    Customer_Address_State = ?, Customer_Address_Zip_Code = ?, 
                    Customer_Address_Country = ?
                WHERE Customer_ID = ?`;

            const values = [
                body.Customer_First_Name, body.Customer_Middle_Name, body.Customer_Last_Name,
                body.Customer_Email_Address, body.Customer_Phone_Number,
                body.Customer_Address_House_Number, body.Customer_Address_Street,
                body.Customer_Address_Suffix, body.Customer_Address_City,
                body.Customer_Address_State, body.Customer_Address_Zip_Code,
                body.Customer_Address_Country, customerId
            ];

            db.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error updating customer data:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Error updating customer data' }));
                } else {
                    if (result.affectedRows === 0) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Customer not found' }));
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Customer updated successfully' }));
                    }
                }
            });
        });
    } else {
        // Route not found
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
};
