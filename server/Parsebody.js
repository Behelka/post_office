// Parsebody.js
const { StringDecoder } = require('string_decoder'); // Import StringDecoder

// Parse JSON request body
function parseBody(req, callback) {
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (chunk) => {
        buffer += decoder.write(chunk);
    });

    req.on('end', () => {
        buffer += decoder.end();
        const body = buffer ? JSON.parse(buffer) : {};
        callback(body);
    });
}

module.exports = parseBody; // Ensure this is present
