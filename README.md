# Car-Rental-Website
Will use Databases & Auth 

## How to Run the Project

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally

### Backend Setup
1. Open a terminal and navigate to the backend folder: cd backend/server
2. Install dependencies:
npm install
3. Start the server:
node server.js
   The backend will run on http://localhost:5000

### Frontend Setup
1. Open another terminal and navigate to the frontend folder:
cd frontend
2. Install dependencies:
npm install
3. Start the development server:
npm run dev

## Authentication (JWT)
The app uses JSON Web Token (JWT) authentication with bcrypt password hashing.

- Passwords are hashed with bcrypt before being stored in MongoDB
- A JWT token is issued on login and registration (expires after 24h)
- Protected backend routes require a valid token in the Authorization header
- Frontend routes redirect to the login page if no token is found
- Standard users can only access their own data
- Administrator users have access to all user data and admin-only routes
