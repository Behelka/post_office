const express = require('express');
const db = require('../db'); // Import db connection
const router = express.Router();

// GET locations route
router.get('/location', async (req, res) => {
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

    try {
        const [results] = await db.query(query); // Use await with db.query
        res.json(results);
    } catch (err) {
        console.error('Error fetching locations:', err);
        return res.status(500).send('Error fetching locations');
    }
});

// POST new location route
// POST new location route
router.post('/location', async (req, res) => {
    const { address } = req.body;
    console.log("address: ", address);

    const addressParts = address.split(','); // Assuming format: '100 Flight St, Dallas, TX 67000, USA'
    
    if (addressParts.length < 4) {
        return res.status(400).json({ message: 'Address is incomplete' });
    }

    const houseNumberAndStreet = addressParts[0].trim(); // '100 Flight St'
    const city = addressParts[1].trim(); // 'Dallas'
    const stateAndZip = addressParts[2].trim().split(' '); // ['TX', '67000']
    const country = addressParts[3].trim(); // 'USA'
    
    // Validate house number and street
    const [houseNumber, ...streetArray] = houseNumberAndStreet.split(' ');
    const street = streetArray.join(' '); // Join remaining parts as the street
    const state = stateAndZip[0]; // 'TX'
    const zipCode = stateAndZip[1]; // '67000'

    // Validate required address fields
    if (!houseNumber || !street || !city || !state || !zipCode || !country) {
        return res.status(400).json({ message: 'All address fields are required' });
    }

    const insertQuery = `
        INSERT INTO location (
            Location_Address_House_Number, 
            Location_Address_Street, 
            Location_Address_Suffix, 
            Location_Address_City, 
            Location_Address_State, 
            Location_Address_Zip_Code, 
            Location_Address_Country
        ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    try {
        // Execute the insert query
        await db.query(insertQuery, [
            houseNumber, 
            street, 
            '', // Optional field for suffix
            city, 
            state, 
            zipCode, 
            country
        ]);

        // Retrieve the last inserted location using LAST_INSERT_ID()
        const [lastLocationQuery] = await db.query(`
            SELECT * FROM location 
            WHERE Location_ID = LAST_INSERT_ID();
        `);

        res.status(201).json(lastLocationQuery[0]); // Respond with the newly created location
    } catch (error) {
        console.error('Error inserting location:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
