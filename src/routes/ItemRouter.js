const router = require("express").Router();
const ItemController = require("../controllers/ItemController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/",[verifyToken], ItemController.create);

// router
//   .route("/")
//   .get(CollectionController.getAllCollections)
//   .post(CollectionController.create)
//   .delete(CollectionController.delete)
//   .patch(CollectionController.update)

module.exports = router;