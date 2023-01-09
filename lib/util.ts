import hasIn from "lodash/hasIn";
import isNaN from "lodash/isNaN";
import isNumber from "lodash/isNumber";
import isInteger from "lodash/isInteger";
import isObject from "lodash/isObject";
import isFunction from "lodash/isFunction";
import { ValidationRuleHasExpectedValueFn } from "../lib/types";

export type Key = string | number | symbol;
export interface InputObject {
  [key: string]: any;
}
export interface InputArray extends Array<any> {
  [key: number]: any;
}
export interface InputFunction extends Function, InputObject {}
export type Input = InputObject | InputArray | InputFunction;
export type InputProp = Key | keyof Input;
export type InputPath = InputProp | InputProp[];

export const RE_OBJECT_PATH_PARTS = /\.|\[(\d+)\]/;
export const RE_OBJECT_PATH_SPLIT = /\.|\[|\]\.?/;

/**
 * Get nested property from an object/array.
 *
 * @param input - The object/array/function that you want to get from.
 * @param prop - The name of the property or the path to the property, e.g. `my.nested[0].property`, `my.nested.0.property`
 * @param defaultValue - If property not found, this is the default value to output, otherwise returns `undefined`.
 * @return {any}
 */
export const get = (input: Input, prop: InputPath, defaultValue?: any) => {
  // Invalid input/prop given? Return defaultValue or undefined
  if (!isObject(input) || !isKey(prop)) return defaultValue;

  // Get single prop
  const _prop = prop instanceof Array && prop.length === 1 ? prop[0] : prop;
  const _propType = typeof _prop;

  // Get value by string/number single prop
  if (
    (_propType === "string" &&
      (String(_prop).indexOf(".") === -1 ||
        String(_prop).indexOf("[") === -1)) ||
    (_propType === "number" && Number(_prop) > -1)
  ) {
    if ((_prop as Key) in input) {
      // @ts-ignore
      return input[_prop];
    } else {
      return defaultValue;
    }
  }

  // Get value by object path
  const _path = String(prop instanceof Array ? prop.join(".") : prop);
  const path = (RE_OBJECT_PATH_SPLIT.test(_path)
    ? _path.split(RE_OBJECT_PATH_SPLIT)
    : [_path]
  ).filter(pathPart => !isEmpty(pathPart));

  if (!path) return defaultValue;

  let output = input;
  const length = path.length;
  for (let i = 0; i < length; i++) {
    // @ts-ignore
    output = output[path[i]];
  }

  return output;
};

/**
 * Set nested property in an object/array.
 *
 * @param input - The object/array that you want to get from.
 * @param prop - The name of the property or the dot path to the property, e.g. `my.nested[0].property`, `my.nested.0.property`
 * @param value - The new value to set.
 * @return {void}
 */
export const set = (input: Input, prop: InputPath, value: any) => {
  // Invalid input/prop given? Return undefined
  if (!isObject(input) || !isKey(prop)) return;

  // Get single prop
  const _prop = prop instanceof Array && prop.length === 1 ? prop[0] : prop;
  const _propType = typeof _prop;

  // Set value by single prop
  if (
    (_propType === "string" &&
      (String(_prop).indexOf(".") === -1 ||
        String(_prop).indexOf("[") === -1)) ||
    (_propType === "number" && Number(_prop) > -1)
  ) {
    // @ts-ignore
    input[_prop] = value;
    return;
  }

  // Set value by object path
  const _path = String(prop instanceof Array ? prop.join(".") : prop);
  const path = (RE_OBJECT_PATH_SPLIT.test(_path)
    ? _path.split(RE_OBJECT_PATH_SPLIT)
    : [_path]
  ).filter(pathPart => !isEmpty(pathPart));

  if (!path) return;

  const ref = path.length > 1 ? get(input, path.slice(0, -1)) : input;
  set(ref, path.slice(-1)[0], value);
};

/**
 * Check if input has a property by name, and can check if has an expected value.
 *
 * If expectedValue param is a function, this will be executed on the input's
 * property value. Return a boolean
 */
export function has(
  input: Input,
  prop: InputPath,
  expectedValue?: ValidationRuleHasExpectedValueFn | any
): boolean {
  return expectedValue === undefined
    ? hasIn(input, prop)
    : hasIn(input, prop) &&
        (isFunction(expectedValue)
          ? !!expectedValue(get(input, prop))
          : get(input, prop) === expectedValue);
}

/**
 * Check if input is truthy.
 */
export function isTruthy(input: any): boolean {
  return !!input;
}

/**
 * Check if input is falsy.
 */
export function isFalsy(input: any): boolean {
  return !input;
}

/**
 * Check if input is a valid object key or path.
 */
export const isKey = (input: any) => {
  const type = typeof input;
  return (
    type === "string" ||
    (type === "number" && input > -1) ||
    (input instanceof Array && input.length)
  );
};

/**
 * Check if input is empty value.
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
 */
export function isFloat(input: any): boolean {
  return (
    !isNaN(input) && isNumber(input) && !isInteger(input) && input !== Infinity
  );
}

/**
 * Check if any of the values are within the input array.
 */
export function anyInArray(input: any[], ...values: any[]): boolean {
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
 */
export function allInArray(input: any[], ...values: any[]): boolean {
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
