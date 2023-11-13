const generateValidationMiddleware = require("../middlewareHelper/generateValidationMiddleware");
const fields = [{ name: "name" }, { name: "description" }, { name: "theme" }];
const createCollection = generateValidationMiddleware(fields, "collection");

module.exports = createCollection;
