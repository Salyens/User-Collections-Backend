const router = require("express").Router();
const userRouter = require("./UserRouter");
const CollectionRouter = require("./CollectionRouter");
const ItemRouter = require("./ItemRouter");
const TagsRouter = require("./TagsRouter");

router.use("/users", userRouter);
router.use("/collections", CollectionRouter);
router.use("/items", ItemRouter);
router.use("/tags", TagsRouter);



module.exports = router;
