const isEmpty = (fields, unit) => {
  const errors = [];
  for (const key in fields) {
    if (typeof fields[key] === "string" && !fields[key].trim()) {
      errors.push(`The ${unit} ${key} is required`);
    } else if (!fields[key]) {
      errors.push(`The ${unit} ${key} is required`);
    }
  }
  return errors;
};
module.exports = isEmpty;
