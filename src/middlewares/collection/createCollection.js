const generateValidationMiddleware = require("../middlewareHelper/generateValidationMiddleware");
const fields = [{ name: "name" }, { name: "description" }];
const createCollection = generateValidationMiddleware(fields, "collection");

module.exports = createCollection;
