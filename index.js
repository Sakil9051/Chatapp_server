const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookiesParser = require('cookie-parser');
const { app, server } = require('./socket/index');

const allowedOrigin = process.env.FRONTEND_URL; // Set this in your .env file

app.use(cors({
    origin: function (origin, callback) {
        console.log(`Request origin: ${origin}`); // Log the origin for debugging
        if (!origin || origin === allowedOrigin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
    allowedHeaders: ['Content-Type', 'Authorization'] // Specify the headers you want to allow
}));

app.use(express.json());
app.use(cookiesParser());

const PORT = process.env.PORT || 8080;

app.get('/', (request, response) => {
    response.json({
        message: "Server running at " + PORT
    });
});

// API endpoints
app.use('/api', router);

connectDB().then(() => {
    console.log("Server connected to the MongoDB server");
    console.log(`Allowed origin: ${allowedOrigin}`);
    server.listen(PORT, () => {
        console.log("Server running at " + PORT);
    });
});
