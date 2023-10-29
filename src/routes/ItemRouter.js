const router = require("express").Router();
const ItemController = require("../controllers/ItemController");
const { verifyToken } = require("../middlewares/auth");
const { createItem } = require("../middlewares/item");
const { tagsValidation } = require("../middlewares/item");
const { updateItem } = require("../middlewares/item");

router
  .route("/")
  .get(ItemController.getAllItems)
  .post([verifyToken, createItem, tagsValidation], ItemController.create)
  .delete([verifyToken], ItemController.delete);

router
  .route("/:id")
  .patch(
    [verifyToken, updateItem, tagsValidation, tagsValidation],
    ItemController.update
  );

module.exports = router;
