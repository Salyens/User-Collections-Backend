const router = require("express").Router();
const userRouter = require("./UserRouter");

router.use("/users", userRouter);

module.exports = router;
