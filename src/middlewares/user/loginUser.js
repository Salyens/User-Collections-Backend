
const loginUser = (req, res, next) => {
    const {
      body: { email, password },
    } = req;
    if(!email || !password) return res.status(422).send({ message:"Both email and password fields are required for login"});
    return next();
  };
  module.exports = loginUser;