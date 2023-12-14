const router = require("express").Router();
const CollectionController = require("../controllers/CollectionController");
const { verifyToken } = require("../middlewares/auth");
const { createCollection } = require("../middlewares/collection");
const { updateCollection } = require("../middlewares/collection");
const multer = require("multer");
const multerErrorHandler = require("../middlewares/collection/multerErrorHandler");
const path = require("path");
const checkUploadFolder = require("../middlewares/collection/checkUploadFolder");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "src", "uploads");
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
});

router
  .route("/")
  .get(CollectionController.getAllCollections)
  .post(
    [
      verifyToken,
      checkUploadFolder,
      upload.single("imgURL"),
      multerErrorHandler,
      createCollection,
    ],
    CollectionController.create
  );

router.get("/my", [verifyToken], CollectionController.getAllCollections);

router
  .route("/:collectionName")
  .get(CollectionController.getOneCollection)
  .delete([verifyToken], CollectionController.delete);

router
  .route("/:id")
  .patch(
    [
      verifyToken,
      upload.single("imgURL"),
      multerErrorHandler,
      updateCollection,
    ],
    CollectionController.update
  );

module.exports = router;
