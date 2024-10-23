/*
How to basic for our back-end Server
If there are errors we can fix them later.

if you haven't npm install in server folder

step #1 create a new filename ending with Route.js
this file will be in server/Routes/filenameRoute.json
inside will put this in 
*/
const db = require('../db'); // Import your db connection
const url = require('url');
const parseBody = require('../Parsebody');
const addLocationRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    //code goes inside here

};

module.exports = addLocationRoute;

/*
step #2 go into server/Routes/appRoute.js file copy the 2 lines
and rename it to your file name and setup a name for it
*/

const handlefilenameRoutes = require('./filenameRoute');

//then where it says Route handling continue the if statement
if (parsedUrl.pathname.startsWith('/api/location')) {
    handleLocationRoutes(req, res);
}
//copy the bottem part, change the names and add it to the if chain
else if (parsedUrl.pathname.startsWith('/api/filename')) {
    handlefilenameRoutes(req, res);
}

/*everyting step: step #3 first decide what the page needs

this is the basic code to work with db 

this is the query you write for the case you need
*/
const query = `
        SELECT 
            AttrubuteName(s),
        FROM 
            TableName 
        WHERE 
            Condition
    `;



//examples based off of AddLocationRoute.js 

//case 1: If you want to grab data from db 
//in filenameRoute.js

//Back-end use GET to grab info

//for the part where it says

//code goes inside here
if (req.method === 'GET' && parsedUrl.pathname === '/api/filename'){
    const Query =  `SELECT
                        AttrubuteName(s)
                     FROM 
                        TableName 
                    WHERE 
                        Condition
                    Delete_Location != 1;`;
        db.query(Query)
        .then(([results]) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        })
        .catch(error => {
            console.error('Error querying locations:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        });
}

//Front-end
const fetchInfo = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/filename');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();


        //how you deal with the data this is what the AddLocation looks like
        //eg for id = 52, address: "1003 Main St, Anytown, CA 90210, USA"
        const formattedData = result.map((item) => ({
            location_id: result.Location_ID, // Use ID from the result
            address: `
            ${result.Location_Address_House_Number} 
            ${result.Location_Address_Street} 
            ${result.Location_Address_Suffix || ''}, 
            ${result.Location_Address_City}, 
            ${result.Location_Address_State} 
            ${result.Location_Address_Zip_Code}, 
            ${result.Location_Address_Country}`
        }));
        setData(formattedData);
    } catch (error) {
        console.error('Error fetching locations:', error);
    }
};

//case 2: adding new data to db
//this example we're using location as base
//Back-end - use POST to add data 

//how much you pass through from the front end
//you pull out of req.body from back end this case 7
//!!change link!!
if(0){}
//we chain the if else for more request
else if (req.method === 'POST' && parsedUrl.pathname === '/api/filenane') {
    parseBody(req, async (body) => {
        const { 
            houseNumber, 
            street, 
            suffix, 
            city, 
            state, 
            zipCode, 
            country } = body;

        // here you can Validate required fields
        if (!houseNumber || !street || !city || !state || !zipCode || !country) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'All address fields are required' }));
        }

        try {
            //replace for you query template for data entry
            const insertQuery = `
            INSERT INTO location (
            Location_Address_House_Number, 
            Location_Address_Street, 
            Location_Address_Suffix, 
            Location_Address_City, 
            Location_Address_State, 
            Location_Address_Zip_Code, 
            Location_Address_Country) 
            VALUES (?, ?, ?, ?, ?, ?, ?);`;

            //each attribute maps to ? both 7
            await db.query(insertQuery, [houseNumber, street, suffix, city, state, zipCode, country]);

            const [lastLocationQuery] = await db.query(`SELECT * FROM location WHERE Location_ID = LAST_INSERT_ID();`);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(lastLocationQuery[0]));
        } catch (error) {
            console.error('Error inserting location:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    });
} 

    


//Front-end - call POST in method for adding
const handleSubmit = async (e) => {
        e.preventDefault();

        //here replace with info to add row for selected Table
        //parameters for location
        const newInput = {
        houseNumber: editHouseNumber || '',  // Default to empty string if undefined
        street: editStreet || '',
        suffix: editSuffix || '',  // Optional fields can remain empty
        city: editCity || '',
        state: editState || '',
        zipCode: editZipCode || '',
        country: editCountry || '',
        };


        try {
            //!!change link!!
             
                const response = await fetch('http://localhost:3001/api/filename', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newInput),
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const result = await response.json();

            //this is to update replace with your set data stuff
                setData([...data, {
                    location_id: result.Location_ID, // Use ID from the result
                address: `
                ${result.Location_Address_House_Number} 
                ${result.Location_Address_Street} 
                ${result.Location_Address_Suffix || ''}, 
                ${result.Location_Address_City}, 
                ${result.Location_Address_State} 
                ${result.Location_Address_Zip_Code}, 
                ${result.Location_Address_Country}`
                }]);
            
                clearInputFields();
            } catch (error) {
            console.error('Error adding location:', error);
        }
};

//case 3: Update existing data

//back-end - use PUT to update multiple fields
if(0){}
//this here is using location_id in url as a pramameter you can pass normally or this
else if (req.method === 'PUT' && parsedUrl.pathname.startsWith('/api/Filename/')) {
    const Location_ID = parsedUrl.pathname.split('/')[3]; // Get the ID from the URL
    parseBody(req, async (body) => {
        const { 
            houseNumber, 
            street, 
            suffix, 
            city, 
            state, 
            zipCode, 
            country 
        } = body;

        // Validate required fields
        if (!houseNumber || !street || !city || !state || !zipCode || !country) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'All address fields are required' }));
        }

        try {
            const updateQuery = `
            UPDATE location 
            SET Location_Address_House_Number = ?, 
            Location_Address_Street = ?, 
            Location_Address_Suffix = ?, 
            Location_Address_City = ?, 
            Location_Address_State = ?, 
            Location_Address_Zip_Code = ?, 
            Location_Address_Country = ? 
            WHERE Location_ID = ?;`;

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

            const [updatedLocationQuery] = await db.query(`SELECT * FROM location WHERE Location_ID = ?;`, [Location_ID]);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedLocationQuery[0]));
        } catch (error) {
            console.error('Error updating location:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    });
}

//front-end
try {
    const response = await fetch(`http://localhost:3001/api/location/${data[editIndex].location_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLocation),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const updatedData = data.map((location, idx) =>
        idx === editIndex ? { ...location, address: `${editHouseNumber} ${editStreet} ${editSuffix}, ${editCity}, ${editState} ${editZipCode}, ${editCountry}` } : location
    );

    setData(updatedData);
    setEditMode(false);
    setEditIndex(null);
} catch (error) {
    console.error('Error updating location:', error);
}

//patch is single attribute edit mode