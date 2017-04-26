# JavaScript API Boilerplate

## Technologies Used

* Node.js
* Express & basic middleware (`helmet`, `morgan`, `compression`, `express-session` with `mongo-connect`, `body-parser`, `passport`, error-handling)
* MongoDB, Mongoose, and native promises in place of Mongoose's implementation
* `dotenv` to load environment variables from a `.env` into `process.env`

## Other Useful Things This Boilerplate Includes

* Routes for authentication (via Passport) & for users
* A user model with hashing, salting, and password verification (using `bcryptjs`)

## Installation

You'll need [Node.js with NPM](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/) installed and set up.

### Install Dependencies

Once you have Node.js with NPM, install the app's dependencies by executing the following command:

```
npm install
```

### Secrets

Create a `.env` file in the root directory. Add the following key-value pairs:

```
SESSION_SECRET=your_session_secret_here
```

(Don't put quotes around each value.)

### MongoDB

When the dependencies have been installed and your `.env` file has been configured, open a terminal window and start MongoDB with the following command:

```
mongod
```

### Start!

Start the server with the following command in a different terminal window:

```
npm start
```

The API will then be accessible at [http://localhost:3000](http://localhost:3000).
