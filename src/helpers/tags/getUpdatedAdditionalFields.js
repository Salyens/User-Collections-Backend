const validOneString = require("../validOneString");

const getUpdatedAdditionalFields = (additionalFields, itemToUpdate, foundCollection) => {
  const errors = [];

  const updatedAdditionalFields = Object.entries(additionalFields).reduce((acc, [key, value]) => {
    const collectionField = foundCollection.additionalFields[key];
    const fieldExists = itemToUpdate.additionalFields.hasOwnProperty(key);
    let isCorrectType = collectionField && typeof value.value === collectionField.type;
    
    if (collectionField.type === 'date') {
      const dateValue = new Date(value.value);
      isCorrectType = !isNaN(dateValue.getTime());
      isCorrectType ? value.value = dateValue : errors.push(`Invalid date for field ${key}`)
    }

    const isOneString = collectionField && collectionField.isOneString;
    const error = isOneString ? validOneString(value.value, key) : (!isCorrectType && `Wrong type of field ${key}`);
    error && errors.push(error);

    if (fieldExists && isCorrectType) acc[key] = value;

    return acc;
  }, {});

  return { updatedAdditionalFields, errors };
};

module.exports = getUpdatedAdditionalFields;
