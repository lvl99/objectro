import { ValidationRuleHasExpectedValueFn } from "../lib/types";
export type Key = string | number | symbol;
export interface InputObject {
    [key: string]: any;
}
export interface InputArray extends Array<any> {
    [key: number]: any;
}
export interface InputFunction extends Function, InputObject {
}
export type Input = InputObject | InputArray | InputFunction;
export type InputProp = Key | keyof Input;
export type InputPath = InputProp | InputProp[];
export declare const RE_OBJECT_PATH_PARTS: RegExp;
export declare const RE_OBJECT_PATH_SPLIT: RegExp;
/**
 * Get nested property from an object/array.
 *
 * @param input - The object/array/function that you want to get from.
 * @param prop - The name of the property or the path to the property, e.g. `my.nested[0].property`, `my.nested.0.property`
 * @param defaultValue - If property not found, this is the default value to output, otherwise returns `undefined`.
 * @return {any}
 */
export declare const get: (input: Input, prop: InputPath, defaultValue?: any) => any;
/**
 * Set nested property in an object/array.
 *
 * @param input - The object/array that you want to get from.
 * @param prop - The name of the property or the dot path to the property, e.g. `my.nested[0].property`, `my.nested.0.property`
 * @param value - The new value to set.
 * @return {void}
 */
export declare const set: (input: Input, prop: InputPath, value: any) => void;
/**
 * Check if input has a property by name, and can check if has an expected value.
 *
 * If expectedValue param is a function, this will be executed on the input's
 * property value. Return a boolean
 */
export declare function has(input: Input, prop: InputPath, expectedValue?: ValidationRuleHasExpectedValueFn | any): boolean;
/**
 * Check if input is truthy.
 */
export declare function isTruthy(input: any): boolean;
/**
 * Check if input is falsy.
 */
export declare function isFalsy(input: any): boolean;
/**
 * Check if input is a valid object key or path.
 */
export declare const isKey: (input: any) => number | boolean;
/**
 * Check if input is empty value.
 */
export declare function isEmpty(input: any): boolean;
/**
 * Check if input is a float number.
 */
export declare function isFloat(input: any): boolean;
/**
 * Check if any of the values are within the input array.
 */
export declare function anyInArray(input: any[], ...values: any[]): boolean;
/**
 * Check if all of the values are within the input array.
 */
export declare function allInArray(input: any[], ...values: any[]): boolean;
