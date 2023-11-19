const router = require("express").Router();
const ItemController = require("../controllers/ItemController");
const { verifyToken } = require("../middlewares/auth");
const createItem = require("../middlewares/item/createItem");

const createTags = require("../middlewares/item/createTags");
const updateItem = require("../middlewares/item/updateItem");
const updateTags = require("../middlewares/item/updateTags");

router
  .route("/")
  .get(ItemController.getAllItems)
  .post([verifyToken, createItem, createTags], ItemController.create)
  .delete([verifyToken], ItemController.delete);

router.get("/by-collection/:collectionName", ItemController.getUserItems);

router
  .route("/:id")
  .patch([verifyToken, updateItem, updateTags], ItemController.update);

module.exports = router;
