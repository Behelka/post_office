// Its gonna hold our backend
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;

// Database connection
const db = mysql.createConnection({
    host: 'sqlmaster-24.mysql.database.azure.com',  // Replace with your Azure MySQL hostname
    user: 'postoffice_admin',        // Replace with your MySQL username
    password: 'DatabaseSystem@uh24',    // Replace with your MySQL password
    database: 'team11_project_db' // Replace with your MySQL database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Define a basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Azure-hosted Node.js server with MySQL!');
});

// Example: Fetch data from the MySQL database
app.get('/data', (req, res) => {
    db.query('SELECT * FROM your_table', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});