const generateValidationMiddleware = require("../middlewareHelper/generateValidationMiddleware");
const fields = [{ name: "name" }];
const deleteCollection = generateValidationMiddleware(fields, "collection");

module.exports = deleteCollection;
