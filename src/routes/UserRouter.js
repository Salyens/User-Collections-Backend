const router = require("express").Router();
const UserController = require("../controllers/UserController");
const { loginUser, verifyToken } = require("../middlewares/auth");
const { registrationValid } = require("../middlewares/auth");

router.post("/registration", [registrationValid], UserController.registration);
router.post("/login", [loginUser], UserController.login);
router.get("/me", [verifyToken], (req, res) => res.send(req.user));

module.exports = router;
