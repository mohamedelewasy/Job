const { UnauthenticatedError } = require("../errors/index");
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.id, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = {
  auth,
};
