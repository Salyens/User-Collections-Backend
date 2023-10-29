const generateValidationMiddleware = require("../middlewareHelper/generateValidationMiddleware");

const fields = [
  { name: "name", optional: true },
  { name: "collectionId", optional: true },
  { name: "tags", optional: true },
];

const updateItem = generateValidationMiddleware(fields, "item");

module.exports = updateItem;
