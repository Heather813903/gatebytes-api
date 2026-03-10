GateBytes

GateBytes is a meal kit tracking application for travelers.
Users can create an account, log in, and manage food items they bring on trips.

The application allows users to track quantities, monitor low stock items, and keep their travel food organized.

Live Application

https://gatebytes-api.onrender.com

GitHub Repository

https://github.com/Heather813903/gatebytes-api

Features

* Register a new account
* Log in to the application
* View a dashboard of meal kit items
* Add new items
* Edit existing items
* Delete items
* Track low stock items
* Log out of the application

Technologies Used

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* EJS
* CSS
* Render for deployment

Security Middleware

* helmet
* xss-clean
* express-rate-limit
* cors

Data Models

User
name
email
password (hashed)

KitItem
name
quantity
lowStockThreshold
category
user reference

API Routes

Authentication routes

POST /api/v1/auth/register
POST /api/v1/auth/login

Kit item routes

GET /api/v1/kits
POST /api/v1/kits
PATCH /api/v1/kits/:id
DELETE /api/v1/kits/:id

Installation

Clone the repository

git clone https://github.com/Heather813903/gatebytes-api.git

Navigate to the project folder

cd gatebytes-api

Install dependencies

npm install

Create a .env file and add the following variables

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Start the server

npm run dev

Submission branch for final project review

Refactoring Improvements

Several improvements were made after the initial submission based on reviewer feedback.

Routes for server-rendered pages were moved into a separate pageRoutes.js file to improve organization.

A reusable constant was created for the user ID used in server-rendered routes to remove repeated hardcoded values.

The authentication middleware typo was corrected so the request object is handled properly.

User feedback messages were added to the login and registration pages to provide clear error messages when authentication fails.


Author

Heather Smith
Code The Dream Node and Express Course


