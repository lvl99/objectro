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
export declare function has(input: any, propName: string | (string | number)[], expectedValue?: ValidateValueFn | any): boolean;
/**
 * Check if input is truthy.
 *
 * @param {any} input
 * @return {Boolean}
 */
export declare function isTruthy(input: any): boolean;
/**
 * Check if input is falsy.
 *
 * @param {any} input
 * @return {Boolean}
 */
export declare function isFalsy(input: any): boolean;
/**
 * Check if input is empty value.
 *
 * @param {any} input
 * @return {Boolean}
 */
export declare function isEmpty(input: any): boolean;
/**
 * Check if input is a float number.
 *
 * @param {Number} input
 * @return {Boolean}
 */
export declare function isFloat(input: any): boolean;
/**
 * Check if any of the values are within the input array.
 *
 * @param {Array} input
 * @param {...any} values
 * @return {Boolean}
 */
export declare function anyInArray(input: any, ...values: any[]): boolean;
/**
 * Check if all of the values are within the input array.
 *
 * @param {Array} input
 * @param {...any} values
 * @return {Boolean}
 */
export declare function allInArray(input: any, ...values: any[]): boolean;
