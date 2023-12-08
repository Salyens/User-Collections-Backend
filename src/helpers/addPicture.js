const path = require("path");
const util = require("util");
const fs = require("fs");
const { FILES_FOLDER, BOOKS_SUBFOLDER } = require("./../common/constants");

const addPicture = async (req, wholeBookInfo, isCreate) => {
  const { imgURL } = req.files;
  const mimeType = imgURL.mimetype.split("/")[1];
  const imageBuffer = Buffer.from(imgURL.data, "base64");

  const folderPath = path.resolve(__dirname, `../${FILES_FOLDER}`);
  const subFolderPath = path.resolve(folderPath, BOOKS_SUBFOLDER);

  const fileName = Date.now() + "." + mimeType;
  const filePath = path.resolve(subFolderPath, fileName);

  if (isCreate) {
    let folderExists = false;

    const checkExistUpload = () => {
      fs.access(folderPath, fs.constants.F_OK, (err) => {
        if (!err) folderExists = true;
      });
    };

    const createFolders = () => {
      fs.mkdir(folderPath, () => {});
      fs.mkdir(subFolderPath, () => {});
    };

    checkExistUpload();
    if (!folderExists) createFolders();
  }

  wholeBookInfo["imgURL"] = `/${BOOKS_SUBFOLDER}/${fileName}`;
  await util.promisify(fs.writeFile)(filePath, imageBuffer);
};

module.exports = addPicture;
