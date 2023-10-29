const router = require("express").Router();
const UserController = require("../controllers/UserController");
const { loginUser } = require("../middlewares/auth");
const { registrationValid } = require("../middlewares/auth");

router.post("/registration", [registrationValid], UserController.registration);
router.post("/login", [loginUser], UserController.login);

module.exports = router;
