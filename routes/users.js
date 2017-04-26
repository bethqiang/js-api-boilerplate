const router = require('express').Router();
const User = require('../models/user');

// Get all users
router.get('/', (req, res, next) => {
  User.find({}).exec()
  .then(users => res.json(users))
  .catch(next);
});

// Get one user
router.get('/:id', (req, res, next) => {
  User.findOne({ _id: req.params.id }).exec()
  .then(user => res.json(user))
  .catch(next);
});

// Edit your (and only your) profile
router.put('/:id', (req, res, next) => {
  if (req.user._id === req.params.id) {
    User.findOne({ _id: req.params.id }).exec()
    .then(user => {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      return user.save();
    })
    .then(user => res.json(user))
    .catch(next);
  }
});

module.exports = router;
