// db.js
const mysql = require('mysql2/promise'); // Use the promise-based MySQL2

// Create a connection pool
const pool = mysql.createPool({
    host: 'sqlmaster-24.mysql.database.azure.com',  // Replace with your Azure MySQL hostname
    user: 'postoffice_admin',        // Replace with your MySQL username
    password: 'DatabaseSystem@uh24',    // Replace with your MySQL password
    database: 'post_office', // Replace with your MySQL database name
    port: 3306,
    ssl: {
        rejectUnauthorized: false
    }
});

// Export the pool
module.exports = pool; 
