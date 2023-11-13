const router = require("express").Router();
const ItemController = require("../controllers/ItemController");
const { verifyToken } = require("../middlewares/auth");
const {
  createItem,
  updateItem,

} = require("../middlewares/item");
const createTags = require("../middlewares/item/createTags");
const updateTags = require("../middlewares/item/updateTags");

router
  .route("/")
  .get(ItemController.getAllItems)
  .post([verifyToken, createItem, createTags], ItemController.create)
  .delete([verifyToken], ItemController.delete);

router
  .route("/:id")
  .patch([verifyToken, updateItem, updateTags], ItemController.update);

module.exports = router;
