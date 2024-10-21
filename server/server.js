const express = require('express');
const db = require('./db'); // Import db connection
const cors = require('cors');
const bodyParser = require('body-parser'); // Import body-parser
const port = process.env.PORT || 3000; // Use environment variable for port

const app = express();

// Enable CORS for requests from your frontend (port 3001)
const corsOptions = {
    origin: 'http://localhost:3001', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));

// Middleware for parsing JSON bodies
app.use(bodyParser.json()); // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded requests

// Use routes
const AddLocationRoute = require('./Routes/AddLocationRoute');
app.use('/api', AddLocationRoute);

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
