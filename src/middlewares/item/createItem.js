const generateValidationMiddleware = require("../middlewareHelper/generateValidationMiddleware");

const fields = [{ name: "name" }, { name: "collectionId" }, { name: "tags" }];

const createItem = generateValidationMiddleware(fields, "item");

module.exports = createItem;
