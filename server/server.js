const express = require('express');
const db = require('./db'); // Import db connection
const app = express();
const cors = require('cors');
const port = 3000; // Your server port

// Enable CORS for requests from your frontend (port 3001)
const corsOptions = {
    origin: 'http://localhost:3001', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));

// Use routes
const AddLocationRoute = require('./Routes/AddLocationRoute');
app.use('/api', AddLocationRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
