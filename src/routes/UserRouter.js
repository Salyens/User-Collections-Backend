const router = require("express").Router();
const UserController = require("../controllers/UserController");
const registrationValid = require("../middlewares/registrationValid");

router.post("/registration", [registrationValid], UserController.registration);
router.post("/login", UserController.login);

module.exports = router;
