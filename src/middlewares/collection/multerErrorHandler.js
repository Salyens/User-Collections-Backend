const multer = require("multer");
const multerErrorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.log('error: ', error);
    if(error.code === "LIMIT_FILE_SIZE")
    return res.status(400).send({ message: "File size exceeds the maximum limit of 1 MB. Please upload a smaller file"});
  }
  return next();
};

module.exports = multerErrorHandler;
