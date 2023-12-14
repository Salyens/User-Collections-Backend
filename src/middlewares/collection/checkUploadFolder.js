const fs = require("fs");
const path = require("path");

const checkUploadFolder = (req, res, next) => {
  const uploadDir = path.join(process.cwd(), "src", "uploads");
  console.log("uploadDir: ", uploadDir);

  if (!fs.existsSync(uploadDir)) {
    console.log("Creating uploads directory...");
    fs.mkdirSync(uploadDir, { recursive: true });
  } else {
    console.log("Uploads directory already exists.");
  }

  return next();
};

module.exports = checkUploadFolder;
