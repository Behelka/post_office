const express = require('express');
const db = require('../db'); // Import db connection
const router = express.Router();

// GET locations route
router.get('/location', async (req, res) => {
    const query = `
        SELECT 
            Location_ID,
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
    
    // Split house number and street
    const [houseNumber, ...streetArray] = houseNumberAndStreet.split(' ');
    const streetSuffix = streetArray.join(' ');
    const [street, ...suffixArray] = streetSuffix.split(' ');
    const suffix = suffixArray.join(' ');

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
        await db.query(insertQuery, [
            houseNumber, 
            street, 
            suffix,
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

// PUT route to update location
router.put('/location/:Location_ID', async (req, res) => {
    const { Location_ID } = req.params; // Get Location_ID from the URL parameters
    const { houseNumber, street, suffix, city, state, zipCode, country } = req.body;

    // Validate required address fields
    if (!houseNumber || !street || !city || !state || !zipCode || !country) {
        return res.status(400).json({ message: 'All address fields are required' });
    }

    const updateQuery = `
        UPDATE location
        SET 
            Location_Address_House_Number = ?,
            Location_Address_Street = ?,
            Location_Address_Suffix = ?,
            Location_Address_City = ?,
            Location_Address_State = ?,
            Location_Address_Zip_Code = ?,
            Location_Address_Country = ?
        WHERE Location_ID = ?;
    `;
    
    try {
        await db.query(updateQuery, [
            houseNumber, 
            street, 
            suffix,
            city, 
            state, 
            zipCode, 
            country,
            Location_ID
        ]);

        console.log('Location updated:', houseNumber, street, suffix, city, state, zipCode, country, 'Location ID:', Location_ID);
        res.status(200).json({ message: 'Location updated successfully' });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/api/location/:Location_ID', async (req, res) => {
    const { Location_ID } = req.params;

    const patchQuery = 
        `UPDATE location
        SET Delete_Location = 1
        WHERE Location_ID = ?;`;

    try {
        await db.query(patchQuery, [
            Location_ID
        ]);
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

    if (!location) {
        return res.status(404).json({ message: 'Location not found' });
    }

    res.json({ message: 'Location marked for deletion', location });
});

module.exports = router;