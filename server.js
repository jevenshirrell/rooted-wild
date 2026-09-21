// Load environment variables from the .env file into process.env
require('dotenv').config();

// Import required modules
const express = require('express');
const morgan = require('morgan');

// Initialize the Express application
const app = express();

// ==========================================
// Middleware Configuration
// ==========================================

// Use Morgan to log incoming HTTP requests. 
// 'dev' format provides concise, colored output (Method, URL, Status, Response Time).
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Built-in middleware to parse incoming JSON payloads (e.g., from fetch or axios)
app.use(express.json());

// Built-in middleware to parse incoming URL-encoded data (e.g., from HTML forms)
app.use(express.urlencoded({ extended: true }));


// ==========================================
// Route Definitions
// ==========================================
// In a full MVC setup, you would import your routes from a /routes folder here
// and pass them to your controllers.

// Basic root route to confirm the server is operational
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running successfully!',
        environment: process.env.NODE_ENV
    });
});

// ==========================================
// Server Initialization
// ==========================================

// Define the port, falling back to 3000 if not specified in the environment
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming connections
const server = app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown mechanism for production readiness
// Ensures connections are closed properly when the process is terminated
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});
