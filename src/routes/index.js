const router = require("express").Router();
const userRouter = require("./UserRouter");
const CollectionRouter = require("./CollectionRouter");
const ItemRouter = require("./ItemRouter");

router.use("/users", userRouter);
router.use("/collections", CollectionRouter);
router.use("/items", ItemRouter);


module.exports = router;
