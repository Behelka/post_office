const express = require('express');
const db = require('../db'); // Import db connection
const router = express.Router();

router.get('/location', (req, res) => {
    const query = `
        SELECT 
            Location_Address_House_Number, 
            Location_Address_Street, 
            Location_Address_Suffix, 
            Location_Address_City, 
            Location_Address_State, 
            Location_Address_Zip_Code,
            Location_Address_Country 
        FROM 
            location 
        WHERE 
            Delete_Location != 1;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching locations:', err);
            res.status(500).send('Error fetching locations');
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
