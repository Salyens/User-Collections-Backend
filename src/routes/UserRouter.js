const router = require("express").Router();
const UserController = require("../controllers/UserController");
const registrationValid = require("../middlewares/registrationValid");
const loginUser = require("../middlewares/user/LoginUser");

router.post("/registration", [registrationValid], UserController.registration);
router.post("/login",[loginUser], UserController.login);

module.exports = router;
