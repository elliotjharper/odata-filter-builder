function isString(value) {
  return typeof value === "string";
}

function isDate(value) {
  return (
    typeof value === "object" &&
    Object.prototype.toString.call(value) === "[object Date]"
  );
}

/**
 * @param {string|number|Date} value - whatever typed input value we get
 * @returns {string} - the value serialised, ready to be included in an odata filter query string
 */
function normaliseValue(value) {
  if (isString(value)) {
    return `'${value}'`;
  }

  if (isDate(value)) {
    return value.toISOString();
  }

  return value;
}

export default normaliseValue;
