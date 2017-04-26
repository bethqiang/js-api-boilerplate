const auth = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// Generic passport serialization & deserialization

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
  .then(user => done(null, user))
  .catch(err => done(err));
});

// Local signup
auth.post('/local/signup', (req, res, next) => {
  User.create(req.body)
  .then(user => {
    req.login(user, err => {
      if (err) next(err);
      else res.status(201).json(user);
    });
  })
  .catch(next);
});

// Local login
auth.post('/local/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/api/auth/whoami'
  })(req, res, next);
});

// Local login strategy
// Use email as the username
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  User.findOne({ email }).exec()
  .then(user => {
    if (!user) {
      return done(null, false, { message: 'Incorrect login information.' });
    }
    return user.authenticate(password)
    .then(ok => {
      if (!ok) {
        return done(null, false, { message: 'Incorrect login information.' });
      }
      done(null, user);
    });
  })
  .catch(done);
}));

// Send user info front-end
auth.get('/whoami', (req, res, next) => {
  if (req.user) return res.json(req.user);
  else res.json(null);
});

// Logout
auth.post('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/api/auth/whoami');
});

module.exports = auth;
