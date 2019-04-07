import get from "lodash/get";
import hasIn from "lodash/hasIn";
import isNaN from "lodash/isNaN";
import isNumber from "lodash/isNumber";
import isInteger from "lodash/isInteger";
import isFunction from "lodash/isFunction";
import { ValidateValueFn } from "../lib/types";

/**
 * Check if input has a property by name, and can check if has an expected value.
 *
 * If expectedValue param is a function, this will be executed on the input's
 * property value. Return a boolean
 *
 * @param {Object} input
 * @param {String|Array<String|Number>} propName
 * @param {any|Function} expectedValue
 */
export function has(
  input: any,
  propName: string | (string | number)[],
  expectedValue?: ValidateValueFn | any
): boolean {
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
export function isTruthy(input: any): boolean {
  return !!input;
}

/**
 * Check if input is falsy.
 *
 * @param {any} input
 * @return {Boolean}
 */
export function isFalsy(input: any): boolean {
  return !input;
}

/**
 * Check if input is empty value.
 *
 * @param {any} input
 * @return {Boolean}
 */
export function isEmpty(input: any): boolean {
  return (
    input === undefined ||
    input === null ||
    input === "" ||
    (input instanceof Array && input.length === 0)
  );
}

/**
 * Check if input is a float number.
 *
 * @param {Number} input
 * @return {Boolean}
 */
export function isFloat(input: any): boolean {
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
export function anyInArray(input: any, ...values: any[]): boolean {
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
export function allInArray(input: any, ...values: any[]): boolean {
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
