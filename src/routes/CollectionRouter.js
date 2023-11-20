const router = require("express").Router();
const CollectionController = require("../controllers/CollectionController");
const { verifyToken } = require("../middlewares/auth");
const { createCollection } = require("../middlewares/collection");
const { updateCollection } = require("../middlewares/collection");

router
  .route("/")
  .get(CollectionController.getAllCollections)
  .post([verifyToken, createCollection], CollectionController.create);

router.get("/me", [verifyToken], CollectionController.getAllCollections);

router
  .route("/:collectionName")
  .get(CollectionController.getOneCollection)
  .delete([verifyToken], CollectionController.delete);

router
  .route("/:id")

  .patch([verifyToken, updateCollection], CollectionController.update);

module.exports = router;
