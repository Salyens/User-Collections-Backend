const isExist = (fields, unit) => {

  const errors = [];
  for (const key in fields) {
    if (!fields[key]) {
      errors.push(`The ${unit} ${key} shouldn't be empty`);
    }
  }
  return errors;
};
module.exports = isExist;
