const auth = require('express').Router();
const passport = require('passport');

const User = require('../models/user');

// Generic passport serialization & deserialization

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id)
  .then(user => {
    done(null, user);
  })
  .catch(done);
});

auth.post('/local/signup', (req, res, next) => {
  User.create(req.body)
  .then(user => {
    req.logIn(user, err => {
      if (err) next(err);
      else res.status(201).json(user);
    });
  })
  .catch(next);
});

auth.post('/local/login', (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
  .then(user => {
    if (!user) {
      res.status(401).json({ success: false, message: 'Incorrect login information.' });
    } else {
      return user.authenticate(password)
      .then(ok => {
        if (!ok) {
          res.status(401).res.json({ success: false, message: 'Incorrect login information.' });
        } else {
          req.logIn(user, err => {
            if (err) return next(err);
            return res.json(user);
          });
        }
      })
      .catch(next);
    }
  })
  .catch(next);
});

// Send user info front-end
auth.get('/whoami', (req, res, next) => {
  if (req.user) return res.json(req.user);
  else res.json(null);
});

// Logout
auth.post('/logout', (req, res, next) => {
  req.logOut();
  res.redirect('/api/auth/whoami');
});

module.exports = auth;
