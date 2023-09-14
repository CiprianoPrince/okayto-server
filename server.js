// Load environment variables
require('dotenv').config();

// External dependencies
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Internal dependencies
const corsOptions = require('./config/corsOptions');

const app = express();

// Logging

// Security and req handling

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
    })
);
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Database initialization

// Serve static images
app.use(
    '/storage/uploads/images',
    (req, res, next) => {
        res.header('Cross-Origin-Resource-Policy', 'cross-origin');
        next();
    },
    express.static(path.join(__dirname, 'storage/uploads/images'))
);

// Auth Routes

// Public resource routes

// JWT Verification for API routes

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
