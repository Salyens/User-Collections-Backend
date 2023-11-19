const validOneString = require("../validOneString");

const getUpdatedAdditionalFields = (additionalFields, itemToUpdate, foundCollection) => {
  const errors = [];

  const updatedAdditionalFields = Object.entries(additionalFields).reduce((acc, [key, value]) => {
    const collectionField = foundCollection.additionalFields[key];
    const fieldExists = itemToUpdate.additionalFields.hasOwnProperty(key);
    const isCorrectType = collectionField && typeof value.value === collectionField.type;
    const isOneString = collectionField && collectionField.isOneString;

    const error = isOneString ? validOneString(value.value, key) : (!isCorrectType && `Wrong type of field ${key}`);
    error && errors.push(error);

    if (fieldExists && isCorrectType) acc[key] = value;

    return acc;
  }, {});

  return { updatedAdditionalFields, errors };
};

module.exports = getUpdatedAdditionalFields;


  // const updatedAdditionalFields = {};
    // for (const key in additionalFields) {
    //   if (itemToUpdate.additionalFields.hasOwnProperty(key)) {
    //     if (foundCollection.additionalFields[key]["isOneString"]) {
    //       const error = validOneString(additionalFields[key]["value"], key);
    //       if (error) errors.push(error);
    //     }

    //     if (
    //       typeof additionalFields[key]["value"] ===
    //       foundCollection.additionalFields[key]["type"]
    //     )
    //       updatedAdditionalFields[key] = additionalFields[key];
    //     else errors.push(`Wrong type of field ${key}`);
    //   }
    // }
