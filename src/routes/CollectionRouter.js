const router = require("express").Router();
const CollectionController = require("../controllers/CollectionController");
const { verifyToken } = require("../middlewares/auth");
const {
  createCollection,
  deleteCollection,
} = require("../middlewares/collection");
const { updateCollection } = require("../middlewares/collection");

router
  .route("/")
  .get(CollectionController.getAllCollections)
  .post([verifyToken, createCollection], CollectionController.create)
  .delete([verifyToken, deleteCollection], CollectionController.delete);
  
  router.get('/me',[verifyToken], CollectionController.getAllCollections)

  

router
  .route("/:id")
  .patch([verifyToken, updateCollection], CollectionController.update)
  .get(CollectionController.getOneCollection);


module.exports = router;
