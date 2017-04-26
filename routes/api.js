const api = require('express').Router();

api.use('/auth', require('./auth'))
   .use('/users', require('./users'));

// No routes matched? 404.
api.use((req, res) => res.status(404).end());

module.exports = api;
