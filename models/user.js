const mongoose = require('mongoose');
const validateEmail = require('validator').isEmail;
const bcrypt = require('bcryptjs');

// For salting passwords
const SALT_WORK_FACTOR = 10;

// User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [ validateEmail, 'Invalid email' ]
  },
  // Password not required bc OAuth -> users may or may not have passwords
  password: {
    type: String
  },
});

// Hash and salt passwords before saving to db
UserSchema.pre('save', function (next) {
  const user = this;
  // Save all emails as lowercase in db
  user.email = user.email && user.email.toLowerCase();
  // Only hash and salt if pw has been modified or is new
  if (!user.isModified('password')) return next();
  // Salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);
    // Hash
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      // Set password to be the hashed one
      user.password = hash;
      next();
    });
  });
});

// Instance method to check if the password entered matches the password in the db
UserSchema.methods.authenticate = function (enteredPassword) {
  return new Promise((resolve, reject) =>
    bcrypt.compare(enteredPassword, this.password, (err, result) => (
      err ? reject(err) : resolve(result)
    ))
  );
};

// When sending data from db to anywhere, send everything except id & password
UserSchema.set('toJSON', {
  transform(doc, ret, options) {
    const retJson = {
      _id: ret._id,
      name: ret.name,
      email: ret.email,
    };
    return retJson;
  }
});

module.exports = mongoose.model('User', UserSchema);
