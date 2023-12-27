const { getAPIKey } = require('../db/ApiKeys');

function apiKeyMiddleware(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: 'API key is missing' });
    }

    //logic to check db? 
    if (apiKey !== 'YOUR_API_KEY') {
        return res.status(403).json({ error: 'Invalid API key' });
    }

    // API key is valid, continue to the next middleware or route handler
    next();
}

module.exports = { apiKeyMiddleware } 
