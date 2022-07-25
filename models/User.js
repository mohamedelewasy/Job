const { body } = require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minlength: [3, "name must be at least 3 characters"],
    maxlength: [32, "name must be at most 32 characters"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    validate: {
      validator: function (v) {
        return body(v).isEmail();
      },
    },
    unique: true,
  },

  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [3, "password must be at least 8 characters"],
  },

  isActive: {
    type: Boolean,
    default: false,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(parseInt(Math.random() * 6) + 6);
    user.password = await bcrypt.hash(user.password, salt);
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getJwt = function () {
  return jwt.sign({ id: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LOG_LIFETIME,
  });
};

const User = mongoose.model("Users", userSchema);
module.exports = User;
