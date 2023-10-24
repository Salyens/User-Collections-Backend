const router = require("express").Router();
const UserController = require("../controllers/UserController");

router.post("/registration", UserController.registration);

module.exports = router;