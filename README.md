# Node.js Express MVC Starter

A solid, production-ready boilerplate for building RESTful APIs and web applications using Node.js and Express. This project is structured around the Model-View-Controller (MVC) architecture and includes essential development tools.

## Features

* **Express.js:** Fast, unopinionated, minimalist web framework.
* **MVC Architecture:** Pre-configured directory structure for scalable code organization (`models/`, `views/`, `controllers/`).
* **Environment Configuration:** Secure environment variable management using `dotenv`.
* **Logging:** HTTP request logging in development via `morgan`.
* **Development Workflow:** Auto-restarting development server via `nodemon`.
* **Graceful Shutdown:** Configured to handle `SIGTERM` signals for safe production deployments.

## Prerequisites

Ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v14.x or higher recommended)
* npm (comes with Node.js) or Yarn
* MongoDB (Local instance or an Atlas cluster URI)

## Getting Started

### 1. Installation

Clone the repository and install the dependencies:

```bash
# Install dependencies
npm install
```
## Environment Setup

# Copy the example .env file
cp .env.example .env

# Open the newly created .env file and update the variables:

PORT: The port your server will run on (default: 3000).
NODE_ENV: Set to development for local work.
MONGODB_URI: Your MongoDB connection string.

## Running the Application

```bash
npm run dev
```

## Production 

```bash
npm run start
```

## Project Structure

.
├── controllers/    # Route handlers and business logic
├── models/         # Database schemas and data models
├── views/          # View templates (if rendering HTML on the server)
├── .env            # Environment variables (ignored in version control)
├── .env.example    # Template for environment variables
├── .gitignore      # Ignored files and directories
├── package.json    # Project metadata, scripts, and dependencies
└── server.js       # Main application entry point and middleware configuration
