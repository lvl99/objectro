const get = require("lodash/get");
const set = require("lodash/set");
const hasIn = require("lodash/hasIn");
const isNaN = require("lodash/isNaN");
const isNumber = require("lodash/isNumber");
const isInteger = require("lodash/isInteger");
const isFunction = require("lodash/isFunction");

/**
 * Check if input has a property by name, and can check if has an expected value.
 *
 * If expectedValue param is a function, this will be executed on the input's
 * property value. Return a boolean
 *
 * @param {Object} input
 * @param {String} propName
 * @param {any|Function} expectedValue
 */
function has(input, propName, expectedValue) {
  return expectedValue === undefined
    ? hasIn(input, propName)
    : hasIn(input, propName) &&
        (isFunction(expectedValue)
          ? !!expectedValue.call(undefined, get(input, propName))
          : get(input, propName) === expectedValue);
}

/**
 * Check if input is truthy.
 *
 * @param {any} input
 * @return {Boolean}
 */
function isTruthy(input) {
  return !!input;
}

/**
 * Check if input is falsy.
 *
 * @param {any} input
 * @return {Boolean}
 */
function isFalsy(input) {
  return !input;
}

/**
 * Check if input is a float number.
 *
 * @param {Number} input
 * @return {Boolean}
 */
function isFloat(input) {
  return (
    !isNaN(input) && isNumber(input) && !isInteger(input) && input !== Infinity
  );
}

/**
 * Check if any of the values are within the input array.
 *
 * @param {Array} input
 * @param {...any} values
 * @return {Boolean}
 */
function anyInArray(input, ...values) {
  let output = false;
  let totalValues = values.length;
  if (totalValues) {
    for (let index = 0; index < totalValues; index++) {
      // Stop on first match
      if (input.indexOf(values[index]) > -1) {
        output = true;
        break;
      }
    }
  }

  return output;
}

/**
 * Check if all of the values are within the input array.
 *
 * @param {Array} input
 * @param {...any} values
 * @return {Boolean}
 */
function allInArray(input, ...values) {
  let output = false;
  let totalValues = values.length;
  let countMatched = 0;
  if (totalValues) {
    for (let index = 0; index < totalValues; index++) {
      if (input.indexOf(values[index]) > -1) {
        countMatched++;

        // Must match all
        if (countMatched === totalValues) {
          output = true;
          break;
        }
      }
    }
  }

  return output;
}

const utils = {
  get,
  set,
  has,
  isTruthy,
  isFalsy,
  isFloat,
  anyInArray,
  allInArray
};

module.exports = {
  default: utils,
  ...utils
};
