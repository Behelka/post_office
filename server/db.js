const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
    host: 'sqlmaster-24.mysql.database.azure.com',  // Replace with your Azure MySQL hostname
    user: 'postoffice_admin',        // Replace with your MySQL username
    password: 'DatabaseSystem@uh24',    // Replace with your MySQL password
    database: 'post_office', // Replace with your MySQL database name
    port: 3306,
    ssl: {
        rejectUnauthorized: false
    }
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = db; // Exporting the db connection
