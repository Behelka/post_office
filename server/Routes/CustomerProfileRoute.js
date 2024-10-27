const db = require('../db'); // Import your db connection
const url = require('url');
const parseBody = require('../Parsebody'); // Parse JSON body

const CustomerProfileRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const customerId = parsedUrl.query.customerId;

    // 处理GET请求，获取客户信息
    if (req.method === 'GET' && parsedUrl.pathname === '/api/customer') {
        if (!customerId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Customer ID is required' }));
        }

        const infoQuery = `SELECT * FROM customer WHERE Customer_ID = ?;`;
        db.query(infoQuery, [customerId])
            .then(([results]) => {
                if (results.length > 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(results[0]));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Customer not found' }));
                }
            })
            .catch(error => {
                console.error('Error querying customer:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            });

    // 处理PUT请求，更新客户信息
    } else if (req.method === 'PUT' && parsedUrl.pathname === '/api/customer') {
        parseBody(req, async (body) => {
            const {
                Customer_ID, Customer_First_Name, Customer_Middle_Name, Customer_Last_Name,
                Customer_Phone_Number, Customer_Email_Address, Customer_Address_House_Number,
                Customer_Address_Street, Customer_Address_Suffix, Customer_Address_City,
                Customer_Address_State, Customer_Address_Zip_Code, Customer_Address_Country,
                Customer_Balance
            } = body;

            const updateQuery = `
                UPDATE customer SET 
                    Customer_First_Name = ?, Customer_Middle_Name = ?, Customer_Last_Name = ?,
                    Customer_Phone_Number = ?, Customer_Email_Address = ?, 
                    Customer_Address_House_Number = ?, Customer_Address_Street = ?, 
                    Customer_Address_Suffix = ?, Customer_Address_City = ?, 
                    Customer_Address_State = ?, Customer_Address_Zip_Code = ?, 
                    Customer_Address_Country = ?, Customer_Balance = ?
                WHERE Customer_ID = ?;
            `;

            try {
                await db.query(updateQuery, [
                    Customer_First_Name, Customer_Middle_Name, Customer_Last_Name,
                    Customer_Phone_Number, Customer_Email_Address, 
                    Customer_Address_House_Number, Customer_Address_Street, 
                    Customer_Address_Suffix, Customer_Address_City,
                    Customer_Address_State, Customer_Address_Zip_Code,
                    Customer_Address_Country, Customer_Balance, Customer_ID
                ]);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Customer updated successfully' }));
            } catch (error) {
                console.error('Error updating customer:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            }
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
};

module.exports = CustomerProfileRoute;