const userModel = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const StatusCode = require("http-status-codes");

const register = async (req, res) => {
  const user = await userModel.create(req.body);
  const token = await user.getJwt();

  res.cookie("token", token, {
    maxAge: parseInt(process.env.COOKIE_AGE) * 1000,
  });

  res.json({ user, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new BadRequestError("user not found");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new BadRequestError("password is incorrect");
    }
    const token = await user.getJwt();
    res.cookie("jwt", token, {
      maxAge: parseInt(process.env.COOKIE_AGE) * 1000,
    });
    res.json({ user, token });
  } catch (error) {
    throw new UnauthenticatedError("invalid email or password");
  }
};

module.exports = {
  register,
  login,
};
