const router = require("express").Router();
const ItemController = require("../controllers/ItemController");
const itemValidation = require("../middlewares/item/itemValidation");
const tagsValidation = require("../middlewares/item/tagsValidation");
const updateItem = require("../middlewares/item/updateItem");
const verifyToken = require("../middlewares/verifyToken");

router
  .route("/")
  .get(ItemController.getAllItems)
  .post([verifyToken, itemValidation, tagsValidation], ItemController.create)
  .delete([verifyToken], ItemController.delete)

  router
  .route("/:id")
  .patch([verifyToken, updateItem, tagsValidation, tagsValidation], ItemController.update)


module.exports = router;