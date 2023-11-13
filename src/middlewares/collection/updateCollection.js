const generateValidationMiddleware = require("../middlewareHelper/generateValidationMiddleware");
const fields = [
  { name: "name", optional: true },
  { name: "description", optional: true },
];
const updateCollection = generateValidationMiddleware(fields, "collection");

module.exports = updateCollection;
