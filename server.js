require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || '*'
}));

app.use(express.json());

// API guide
app.get('/', (req, res) => {
    res.json({
        message: 'Study Support API',
        routes: [
            'GET /health',
            'GET /api/records',
            'GET /api/records/:id',
            'POST /api/records',
            'PUT /api/records/:id',
            'DELETE /api/records/:id'
        ]
    });
});

// Database health check
app.get('/health', (req, res) => {
    try {
        db.prepare('SELECT 1').get();
        res.json({
            status: 'OK',
            database: 'connected'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Database connection failed'
        });
    }
});

// Record routes
app.use('/api/records', require('./middleware/records'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});