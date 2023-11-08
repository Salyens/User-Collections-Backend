const generateValidationMiddleware = require("../middlewareHelper/generateValidationMiddleware");

const fields = [{ name: "name" }, { name: "collectionName" }, { name: "tags" }];

const createItem = generateValidationMiddleware(fields, "item");

module.exports = createItem;
