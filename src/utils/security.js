const jwt = require("jsonwebtoken");

const generateToken = (tokenParams, expiresIn) => {
  const token = jwt.sign(tokenParams, process.env.SECRET_KEY, {
    expiresIn,
  });
  return token;
};
module.exports = { generateToken };