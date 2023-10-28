const router = require("express").Router();
const CollectionController = require("../controllers/CollectionController");
const createCollection = require("../middlewares/collection/createCollection");
const updateCollection = require("../middlewares/collection/updateCollection");
const verifyToken = require("../middlewares/verifyToken");

router
  .route("/")
  .get(CollectionController.getAllCollections)
  .post([verifyToken, createCollection], CollectionController.create)
  .delete([verifyToken], CollectionController.delete)

  router
  .route("/:id")
  .patch([verifyToken, updateCollection], CollectionController.update)

module.exports = router;