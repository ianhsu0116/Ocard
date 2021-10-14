const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 50,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 1024,
  },
  googleId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.isAdmin = function () {
  return this.role == "admin";
};

// mongoose schema moddleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    } else {
      return cb(null, isMatch);
    }
  });
};

module.exports = mongoose.model("User", userSchema);
