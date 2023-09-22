// Load environment variables
require('dotenv').config();

const crypto = require('crypto').randomBytes(50).toString('hex');

// External dependencies
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const expressWinston = require('express-winston');

// Internal dependencies
const { verifyJwt, credentials, errorLogger } = require('./middlewares');
const corsOptions = require('./config/corsOptions');
const db = require('./models');

const app = express();

// Logging
app.use(
    expressWinston.errorLogger({
        winstonInstance: errorLogger,
    })
);

// Security and req handling
app.use(credentials);

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
db.sequelize
    .sync()
    .then(() => console.log('Database synced successfully.'))
    .catch((err) => console.error('Error syncing database:', err));

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
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/refresh.routes')(app);
require('./routes/logout.routes')(app);

// Public resource routes
require('./routes/api/category.routes')(app);
require('./routes/api/product.routes')(app);
require('./routes/api/variant.routes')(app);
require('./routes/api/color.routes')(app);
require('./routes/api/size.routes')(app);

// JWT Verification for API routes
app.use(verifyJwt);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
