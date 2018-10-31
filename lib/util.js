import {
  has as lodashHas,
  get,
  isNaN,
  isNumber,
  isInteger,
  isFunction
} from "lodash";

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
export const has = (input, propName, expectedValue) =>
  expectedValue === undefined
    ? lodashHas(input, propName)
    : lodashHas(input, propName) &&
      (isFunction(expectedValue)
        ? !!expectedValue.call(undefined, get(input, propName))
        : get(input, propName) === expectedValue);

export const isTruthy = input => !!input;
export const isFalsy = input => !input;
export const isFloat = input =>
  !isNaN(input) && isNumber(input) && !isInteger(input) && input !== Infinity;

/**
 * Check if any of the values are within the input array.
 *
 * @param {Array} input
 * @param {...any} values
 * @return {Boolean}
 */
export function anyInArray(input, ...values) {
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
export function allInArray(input, ...values) {
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
