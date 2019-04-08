import get from "lodash/get";
import escapeRegExp from "lodash/escapeRegExp";
import castArray from "lodash/castArray";
import isBoolean from "lodash/isBoolean";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isInteger from "lodash/isInteger";
import isArray from "lodash/isArray";
import isArrayLike from "lodash/isArrayLike";
import isMap from "lodash/isMap";
import isSet from "lodash/isSet";
import isObject from "lodash/isObject";
import isObjectLike from "lodash/isObjectLike";
import isPlainObject from "lodash/isPlainObject";
import isFunction from "lodash/isFunction";
import isRegExp from "lodash/isRegExp";
import isDate from "lodash/isDate";
import isNull from "lodash/isNull";
import isUndefined from "lodash/isUndefined";
import isNaN from "lodash/isNaN";
import isNil from "lodash/isNil";
import isError from "lodash/isError";
import {
  POJO,
  ValidationFn,
  ValidationOptions,
  ValidationRules,
  ValidationRulesObject,
  ValidationRuleRange,
  ValidationRuleTypeFns,
  ValidationMatchedRule,
  ValidationRuleTypeFn
} from "../lib/types";
import {
  has,
  isTruthy,
  isFalsy,
  isFloat,
  anyInArray,
  allInArray
} from "./util";

/**
 * Default validate options.
 */
export const DEFAULT_OPTIONS: ValidationOptions = {
  _depth: 0,
  debug: false,
  negateMatch: false,
  matchAll: false,
  skipMissingProps: false,
  caseSensitive: false,
  data: {}
};

/**
 * Factory to create {ValidationOptions} object.
 */
export const generateOptions = (
  options: ValidationOptions = {}
): ValidationOptions => ({
  ...DEFAULT_OPTIONS,
  ...options
});

/**
 * Factory to create {ValidationOptions} object and auto-increment the depth.
 *
 * @param {ValidationOptions} options
 * @return {ValidationOptions}
 */
export const generateOptionsAndIncrementDepth = (
  options: ValidationOptions = {}
): ValidationOptions => ({
  ...DEFAULT_OPTIONS,
  ...options,
  _depth:
    options._depth !== undefined && options._depth >= 0 ? options._depth + 1 : 0
});

/**
 * Type checks and comparison functions.
 */
export const CHECK_TYPE: ValidationRuleTypeFns = {
  bool: isBoolean,
  boolean: isBoolean,
  string: isString,
  number: isNumber,
  integer: isInteger,
  float: isFloat,
  array: isArray,
  arrayLike: isArrayLike,
  map: isMap,
  set: isSet,
  object: isObject,
  objectLike: isObjectLike,
  plainObject: isPlainObject,
  function: isFunction,
  regExp: isRegExp,
  date: isDate,
  null: isNull,
  undefined: isUndefined,
  nan: isNaN,
  nil: isNil,
  error: isError,
  truthy: isTruthy,
  falsy: isFalsy
};

/**
 * The individual validation rules that can be uses.
 */
export const validationRules: ValidationRulesObject = {
  /**
   * Negate the result of the rules on the input.
   *
   * @param {Object} input
   * @param {ValidationRules} rules
   * @param {ValidationOptions} options
   * @return {Boolean}
   */
  not: (
    input: any,
    rules: ValidationRules,
    options: ValidationOptions
  ): boolean =>
    validate(
      input,
      rules,
      generateOptionsAndIncrementDepth({
        ...options,
        matchAll: false,
        negateMatch: has(options, "negateMatch") ? !options.negateMatch : true
      })
    ),

  /**
   * Return true only if all rules match.
   */
  all: (
    input: any,
    rules: ValidationRules,
    options: ValidationOptions
  ): boolean =>
    validate(
      input,
      rules,
      generateOptionsAndIncrementDepth({
        ...options,
        negateMatch: false,
        matchAll: true
      })
    ),

  /**
   * Return true if any one rule matches.
   *
   * @param {Object} input
   * @param {ValidationRules} rules
   * @param {ValidationOptions} options
   * @return {Boolean}
   */
  any: (
    input: any,
    rules: ValidationRules,
    options: ValidationOptions
  ): boolean =>
    validate(
      input,
      rules,
      generateOptionsAndIncrementDepth({
        ...options,
        matchAll: false
      })
    ),

  /**
   * Equality.
   *
   * @param {any} input
   * @param {any} expectedValue
   */
  eq: (input: any, expectedValue: any): boolean => input == expectedValue, // eslint-disable-line eqeqeq

  /**
   * Strict equality.
   *
   * @param {any} input
   * @param {any} expectedValue
   */
  eqs: (input: any, expectedValue: any): boolean => input === expectedValue,

  /**
   * Greater than.
   *
   * @param {any} input
   * @param {any} value
   */
  gt: (input: any, value: any): boolean => input > value,

  /**
   * Greater than or equals.
   *
   * @param {any} input
   * @param {any} value
   */
  gte: (input: any, value: any): boolean => input >= value,

  /**
   * Less than.
   *
   * @param {any} input
   * @param {any} value
   */
  lt: (input: any, value: any): boolean => input < value,

  /**
   * Less than or equals.
   *
   * @param {any} input
   * @param {any} value
   */
  lte: (input: any, value: any): boolean => input <= value,

  /**
   * Input is inside a range.
   *
   * @param {any} input
   * @param {ValidationRuleRange} rules
   * @return {Boolean}
   */
  insideRange: (input: any, rangeRules: ValidationRuleRange): boolean =>
    has(rangeRules, "min") &&
    has(rangeRules, "max") &&
    input > rangeRules.min &&
    input < rangeRules.max,

  /**
   * Input is within a range.
   *
   * @param {any} input
   * @param {ValidationRuleRange} rules
   * @return {Boolean}
   */
  withinRange: (input: any, rangeRules: ValidationRuleRange): boolean =>
    has(rangeRules, "min") &&
    has(rangeRules, "max") &&
    input >= rangeRules.min &&
    input <= rangeRules.max,

  /**
   * Input is within the min value of a range (not including the max value).
   *
   * @param {any} input
   * @param {ValidationRuleRange} rules
   * @return {Boolean}
   */
  withinRangeMin: (input: any, rangeRules: ValidationRuleRange): boolean =>
    has(rangeRules, "min") &&
    has(rangeRules, "max") &&
    input >= rangeRules.min &&
    input < rangeRules.max,

  /**
   * Input is within the max value of a range (not including the min value).
   *
   * @param {any} input
   * @param {ValidationRuleRange} rules
   * @return {Boolean}
   */
  withinRangeMax: (input: any, rangeRules: ValidationRuleRange): boolean =>
    has(rangeRules, "min") &&
    has(rangeRules, "max") &&
    input > rangeRules.min &&
    input <= rangeRules.max,

  /**
   * Input is outside a range.
   *
   * @param {any} input
   * @param {ValidationRuleRange} rules
   * @return {Boolean}
   */
  outsideRange: (input: any, rangeRules: ValidationRuleRange): boolean =>
    has(rangeRules, "min") &&
    has(rangeRules, "max") &&
    input < rangeRules.min &&
    input > rangeRules.max,

  /**
   * Input is in outer range.
   *
   * @param {any} input
   * @param {ValidationRuleRange} rules
   * @return {Boolean}
   */
  outerRange: (input: any, rangeRules: ValidationRuleRange): boolean =>
    has(rangeRules, "min") &&
    has(rangeRules, "max") &&
    input <= rangeRules.min &&
    input >= rangeRules.max,

  /**
   * Input is outer range including the min value (not including the max value).
   *
   * @param {any} input
   * @param {ValidationRuleRange} rules
   * @return {Boolean}
   */
  outerRangeMin: (input: any, rangeRules: ValidationRuleRange): boolean =>
    has(rangeRules, "min") &&
    has(rangeRules, "max") &&
    input <= rangeRules.min &&
    input > rangeRules.max,

  /**
   * Input is outer range including the max value (not including the min value).
   *
   * @param {any} input
   * @param {ValidationRuleRange} rules
   * @return {Boolean}
   */
  outerRangeMax: (input: any, rangeRules: ValidationRuleRange): boolean =>
    has(rangeRules, "min") &&
    has(rangeRules, "max") &&
    input < rangeRules.min &&
    input >= rangeRules.max,

  /**
   * RegExp test.
   *
   * @param {any} input
   * @param {String|RegExp} re
   * @return {Boolean}
   */
  re: (
    input: any,
    re: string | RegExp,
    { caseSensitive = false }: ValidationOptions
  ): boolean =>
    (re instanceof RegExp
      ? re
      : new RegExp(re, !caseSensitive ? "i" : undefined)
    ).test(input),

  /**
   * Check if input starts with a value.
   *
   * @param {String} input
   * @param {Number|String} value
   * @return {Boolean}
   */
  startsWith: (
    input: any,
    value: string | number,
    { caseSensitive = false }: ValidationOptions
  ): boolean =>
    new RegExp(
      `^${escapeRegExp(`${value}`)}`,
      !caseSensitive ? "i" : undefined
    ).test(input + ""),

  /**
   * Check if input ends with a value.
   *
   * @param {String} input
   * @param {Number|String} value
   * @param {Object} options
   * @return {Boolean}
   */
  endsWith: (
    input: any,
    value: string | number,
    { caseSensitive = false }: ValidationOptions
  ): boolean =>
    new RegExp(
      `${escapeRegExp(`${value}`)}$`,
      !caseSensitive ? "i" : undefined
    ).test(input + ""),

  /**
   * Check if input contains value.
   *
   * @param {String|Array} input
   * @param {any} value
   * @param {Object} options
   * @return {Boolean}
   */
  contains: (
    input: any,
    value: any,
    { caseSensitive = false }: ValidationOptions
  ): boolean =>
    isArray(input)
      ? input.indexOf(value) > -1
      : caseSensitive
      ? input.indexOf(value) > -1
      : new RegExp(`${escapeRegExp(value)}`, "i").test(input),

  /**
   * Check if input includes any specified values.
   *
   * @param {any} input
   * @param {any} values
   * @return {Boolean}
   */
  includesAny: (input: any, values: any[]): boolean =>
    anyInArray(castArray(input), ...castArray(values)),

  /**
   * Check if input includes all specified values.
   *
   * @param {any} input
   * @param {any} values
   * @return {Boolean}
   */
  includesAll: (input: any, values: any[]): boolean =>
    allInArray(castArray(input), ...castArray(values)),

  /**
   * Check if input is a specific type.
   *
   * @param {any} input
   * @param {CheckType} type
   * @return {Boolean}
   */
  type: (input: any, type: string): boolean =>
    has(CHECK_TYPE, type, isFunction) &&
    (CHECK_TYPE[type] as ValidationRuleTypeFn)(input),

  /**
   * Check if input has existence of one or many properties, or property
   * value is one or many possible values.
   *
   * @param {Object} input
   * @param {ValidationRules} props
   * @return {Boolean}
   */
  has: (
    input: any,
    props: ValidationRules,
    options: ValidationOptions
  ): boolean => {
    let isValid = false;
    let totalProps = 0;
    let countMatched = 0;

    // Check if has multiple props
    if (isString(props) || isArray(props)) {
      // Array
      if (isArray(props)) {
        totalProps = props.length;

        // console.log("validationRule.has: array", {
        //   props,
        //   totalProps
        // });

        // Match only if all properties exist
        if (has(options, "matchAll", isTruthy)) {
          for (let index = 0; index < totalProps; index++) {
            const propName = props[index];

            if (
              has(options, "skipMissingProps", isTruthy) &&
              !has(input, propName) &&
              !has(options, `data.${propName}`)
            ) {
              totalProps--;
              continue;
            }

            countMatched += has(input, propName) ? 1 : 0;
          }

          isValid = countMatched === totalProps;
        }
        // Match if any one property exists
        else {
          for (let index = 0; index < totalProps; index++) {
            const propName = props[index];

            if (
              has(options, "skipMissingProps", isTruthy) &&
              !has(input, propName) &&
              !has(options, ["data", propName])
            ) {
              totalProps--;
              continue;
            }

            if (has(input, propName)) {
              isValid = true;
              break;
            }
          }
        }
      }
      // String
      else {
        isValid = has(input, props);
      }
    }
    // Check if has props with specific values
    else if (isObject(props)) {
      let propNames = Object.keys(props);
      totalProps = propNames.length;

      // Iterate through all the shallow props given
      for (let index = 0; index < totalProps; index++) {
        let propName = propNames[index];

        if (
          has(options, "skipMissingProps", isTruthy) &&
          !has(input, propName) &&
          !has(options, ["data", propName])
        ) {
          totalProps--;
          continue;
        }

        let propValue =
          isArray(input) || has(input, propName)
            ? get(input, propName)
            : has(options, `data.${propName}`)
            ? get(options.data, propName)
            : undefined;

        let arrayPropValue = castArray(propValue);
        let checkEachValueExists = castArray((props as POJO)[propName]);

        // Match if all values are within
        if (has(options, "matchAll", isTruthy)) {
          isValid = allInArray(arrayPropValue, ...checkEachValueExists);
        }
        // Match if any values are within
        else {
          isValid = anyInArray(arrayPropValue, ...checkEachValueExists);
        }

        if (isValid) {
          countMatched++;

          if (has(options, "matchAll", isTruthy)) {
            isValid = countMatched === totalProps;
          } else {
            break;
          }
        }
      }
    }

    return isValid;
  },

  /**
   * Perform extra validation rules on the prop's values.
   */
  match: (
    input: any,
    props: ValidationRules,
    options: ValidationOptions
  ): boolean => {
    let isValid = false;
    let countMatched = 0;
    let totalProps = 0;

    if (isObject(props)) {
      const propNames = Object.keys(props);
      totalProps = propNames.length;

      // Iterate through all the shallow props given
      for (let index = 0; index < totalProps; index++) {
        const propName: string = propNames[index];

        // Skip missing props
        if (
          has(options, "skipMissingProps", isTruthy) &&
          !has(input, propName) &&
          !has(options, `data.${propName}`)
        ) {
          totalProps--;
          continue;
        }

        const rules: ValidationRules = get(props, propName);

        // Use the input or the extra meta data passed in the options
        let propValue = has(input, propName)
          ? get(input, propName)
          : has(options, `data.${propName}`)
          ? get(options.data, propName)
          : undefined;

        isValid = validate(
          propValue,
          rules,
          generateOptions({ data: options.data || {} })
        );

        if (isValid) {
          countMatched++;

          if (has(options, "matchAll", isTruthy)) {
            isValid = countMatched === totalProps;
          } else {
            break;
          }
        }
      }
    }

    return isValid;
  }
};

/**
 * Validate an object against a set of rules.
 *
 * You can also pass an options object to affect how rules are enforced.
 */
export function validate(
  input: any,
  rules: ValidationRules | any,
  options?: ValidationOptions
): boolean {
  const _options = generateOptions({
    ...options,
    _depth: get(options, "_depth", 0)
  });
  let totalRules = 1;
  let matchedRules = [];
  let countMatchedRules = 0;
  let isValid = false;

  // Increment number of matched rules (and if debug is enabled, add to the result list of matchedRules)
  const matchedRule = ({
    ruleName,
    ruleValue,
    input,
    options,
    isValid
  }: ValidationMatchedRule): void => {
    if (isValid) {
      countMatchedRules++;
    }

    if (options.debug) {
      const ruleResult = {
        ruleName,
        ruleValue,
        input,
        options,
        isValid,
        totalRules,
        countMatchedRules
      };
      matchedRules.push(ruleResult);
    }
  };

  // Rules is function
  if (isFunction(rules)) {
    isValid = rules(input, rules, _options);

    if (isValid) {
      matchedRule({
        ruleName: "fn",
        ruleValue: rules,
        input,
        options: _options,
        isValid
      });
    }
  }
  // Rules is object with multiple rules
  else {
    const ruleNames = Object.keys(rules);
    totalRules = ruleNames.length;

    for (let index = 0; index < totalRules; index++) {
      const ruleName = ruleNames[index];
      const ruleValue = (rules as ValidationRulesObject)[ruleName];

      // Use a custom function
      if (isFunction(ruleValue)) {
        isValid = (ruleValue as ValidationFn)(input, ruleValue, _options);
      }
      // Use a validation rule
      else if (has(validationRules, ruleName, isFunction)) {
        const verifyRuleFn = validationRules[ruleName] as ValidationFn;
        isValid = verifyRuleFn(input, ruleValue, _options);
      }

      if (isValid) {
        matchedRule({ ruleName, ruleValue, input, options: _options, isValid });

        // Must match all rules to be valid
        if (
          has(_options, "matchAll", isTruthy) &&
          countMatchedRules !== totalRules
        ) {
          isValid = false;
        }
        // Otherwise break on first match to stop looking and speed up response
        else {
          break;
        }
      } else {
        matchedRule({ ruleName, ruleValue, input, options: _options, isValid });
      }
    }
  }

  const output = has(_options, "negateMatch", isTruthy) ? !isValid : isValid;

  return output;
}

export default validate;

/**
 * An object which contains the validation rules to apply.
 *
 * Validation rules can be nested within validation rules and also modified.
 *
 * You can also change the behaviour of some rules' matching capabilities:
 *   - `any`: match any rule given (this is the default behaviour)
 *   - `all`: match all rules given
 *   - `not`: negate the returned value
 *
 * The following example would return `true` if the input value is an object
 * and does not have `name` and `age` as properties:
 *
 * ```js
 *   validate(exampleObject, {
 *     all: {
 *       type: "object",
 *       not: {
 *         has: ["name", "age"]
 *       }
 *     }
 *   })
 *
 *   // {}                    -> true
 *   // { "example": true }   -> true
 *
 *   // "{}"                  -> false
 *   // { "name": "Example" } -> false
 *   // { "age": 55 }         -> false
 *   // { "name": "Example",
 *   //   "age": 55 }         -> false
 * ```
 *
 * You can nest these modifier rules to make detailed matches.
 *
 * The following example would return `true` if the input object has a `language`
 * property that has/contains the string values `fr` or `de` and is not/does not
 * contain the string value `en`.
 *
 * `has` can match to an exact property value or can match multiple values by using
 * an array.
 *
 * ```js
 *   validate(exampleObject, {
 *     all: {
 *       any: {
 *         has: {
 *           language: ["fr", "de"]
 *         },
 *       },
 *       not: {
 *         has: {
 *           language: "en"
 *         }
 *       }
 *     }
 *   })
 *
 *   // { "language": [ "en", "de" ] }       -> false
 *   // { "language": [ "en", "fr" ] }       -> false
 *   // { "language": "en" }                 -> false
 *   // { "language": [ "de", "fr" ] }       -> true
 *   // { "language": [ "fr", "nl" ] }       -> true
 *   // { "language": [ "de", "nl" ] }       -> true
 *   // { "language": [ "de", "fr", "nl" ] } -> true
 *   // { "language": "de" }                 -> true
 *   // { "language": "fr" }                 -> true
 * ```
 *
 * @typedef {Object} ValidationRules
 */

/**
 * @typedef {Object} ValidationOptions
 * @prop {Number} _depth - The depth of the validation call
 * @prop {Boolean} negateMatch - Return the opposite of the match's result
 * @prop {Boolean} matchAll - Return true only if all rules within the {ValidationRules} object match
 * @prop {Boolean} skipMissingProps - Pass properties on the input object if they don't exist/are undefined
 * @prop {Boolean} caseSensitive - Enable or disable case sensitive mode
 */
