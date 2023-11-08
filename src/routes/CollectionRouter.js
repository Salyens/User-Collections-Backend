const router = require("express").Router();
const CollectionController = require("../controllers/CollectionController");
const { verifyToken } = require("../middlewares/auth");
const { createCollection, deleteCollection } = require("../middlewares/collection");
const { updateCollection } = require("../middlewares/collection");

router
  .route("/")
  .get(CollectionController.getCollections)
  .post([verifyToken, createCollection], CollectionController.create)
  .delete([verifyToken, deleteCollection], CollectionController.delete)

router
  .route("/:id")
  .patch([verifyToken, updateCollection], CollectionController.update);

router
  .route("/addFields")
  .post([verifyToken], CollectionController.addNewFields);

module.exports = router;
