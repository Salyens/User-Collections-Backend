const router = require("express").Router();
const UserController = require("../controllers/UserController");
const checkIsAdmin = require("../middlewares/admin/checkIsAdmin");
const { loginUser, verifyToken } = require("../middlewares/auth");
const { registrationValid } = require("../middlewares/auth");

router.post("/registration", [registrationValid], UserController.registration);
router.post("/login",[loginUser], UserController.login);
router.get("/me", [verifyToken], (req, res) => res.send(req.user));

router
  .route("/")
  .get([verifyToken, checkIsAdmin], UserController.getAllUsers)
  .post([verifyToken, checkIsAdmin], UserController.update)
  .delete([verifyToken, checkIsAdmin], UserController.delete);

module.exports = router;
