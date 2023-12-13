const checkIsAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin" && role !== "root")
    return res
      .status(400)
      .send({ message: "You do not have permission to view this page." });
  return next();
};
module.exports = checkIsAdmin;
