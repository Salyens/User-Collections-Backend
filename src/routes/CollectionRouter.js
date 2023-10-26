const router = require("express").Router();
const CollectionController = require("../controllers/CollectionController");
const verifyToken = require("../middlewares/verifyToken");

router
  .route("/")
  .get(CollectionController.getAllCollections)
  .post([verifyToken], CollectionController.create)
  .delete([verifyToken], CollectionController.delete)

  router
  .route("/:id")
  .patch([verifyToken], CollectionController.update)

module.exports = router;