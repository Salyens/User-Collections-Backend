const fs = require("fs");
const path = require("path");

const checkUploadFolder = (req, res, next) => {
  const uploadDir = path.join(process.cwd(), "src", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  return next();
};

module.exports = checkUploadFolder;
