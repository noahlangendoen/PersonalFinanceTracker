const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const securityMiddleware = (app) => {
    app.use(helmet());

    // Only sanitize req.body to avoid the error
    app.use((req, res, next) => {
        if (req.body) {
            mongoSanitize.sanitize(req.body);
        }
        next();
    });
};

module.exports = securityMiddleware;