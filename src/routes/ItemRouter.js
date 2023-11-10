const router = require("express").Router();
const ItemController = require("../controllers/ItemController");
const { verifyToken } = require("../middlewares/auth");
const {
  createItem,
  updateItem,
  tagsValidation,
} = require("../middlewares/item");
const {
  validateAdditionalFields,
  additionalFieldsValid,
} = require("../middlewares/item/additionalFieldsValid");

router
  .route("/")
  .get(ItemController.getAllItems)
  .post(
    [
      verifyToken,
      createItem,
      tagsValidation,
      ...validateAdditionalFields,
      additionalFieldsValid,
    ],
    ItemController.create
  )
  .delete([verifyToken], ItemController.delete);

router
  .route("/:id")
  .patch(
    [
      verifyToken,
      updateItem,
      tagsValidation,
      ...validateAdditionalFields,
      additionalFieldsValid,
    ],
    ItemController.update
  );

module.exports = router;
