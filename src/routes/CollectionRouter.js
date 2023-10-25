const router = require("express").Router();
const CollectionController = require("../controllers/CollectionController");
const verifyToken = require("../middlewares/verifyToken");

router
  .route("/")
  .get(CollectionController.getAllCollections)
  .post([verifyToken], CollectionController.create)
  .delete(CollectionController.delete)
  .patch(CollectionController.update)

module.exports = router;