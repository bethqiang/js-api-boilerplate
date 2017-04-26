require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const chalk = require('chalk');

// Create an instance of Express
const app = express();

// Use native promises with mongoose
mongoose.Promise = global.Promise;

// DB setup
// Change the name "test" of the local database to a name of your choosing
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test', (err) => {
  if (err) console.log(chalk.red('*** Error connecting to db *** \n', err));
  else console.log(chalk.blue('--- Successfully connected to db ---'));
});

// Set security-related HTTP headers
app.use(helmet());

// Logging middleware
app.use(morgan('common'));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: true
}));

// Authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', require('./routes/api'));

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(chalk.blue(`--- Listening on port ${port} ---`));
});

// Error-handling middleware
app.use('/', (err, req, res, next) => {
  console.log(chalk.red(`*** Error: ${err.message} ***`));
  res.sendStatus(err.status || 500);
});
