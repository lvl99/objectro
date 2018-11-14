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
  has,
  isTruthy,
  isFalsy,
  isFloat,
  anyInArray,
  allInArray
} from "./util";

/**
 * Default validate options.
 *
 * @type {ValidationOptions}
 */
export const DEFAULT_OPTIONS = {
  _depth: 0,
  debug: false,
  negateMatch: false,
  matchAll: false,
  skipMissingProps: false,
  data: {}
};

/**
 * Factory to create {ValidationOptions} object.
 *
 * @param {ValidationOptions} options
 * @return {ValidationOptions}
 */
const generateOptions = options => ({
  ...DEFAULT_OPTIONS,
  ...options
});

/**
 * Factory to create {ValidationOptions} object and auto-increment the depth.
 *
 * @param {ValidationOptions} options
 * @return {ValidationOptions}
 */
const generateOptionsAndIncrementDepth = options => ({
  ...DEFAULT_OPTIONS,
  ...options,
  _depth: parseInt(options._depth, 10) + 1
});

/**
 * Type checks and comparison functions.
 */
export const CHECK_TYPE = {
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
export const validationRules = {
  /**
   * Negate the result of the rules on the input.
   *
   * @param {Object} input
   * @param {ValidationRules} rules
   * @param {ValidationOptions} options
   * @return {Boolean}
   */
  not: (input, rules, options) =>
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
   *
   * @param {Object} input
   * @param {ValidationRules} rules
   * @param {ValidationOptions} options
   * @return {Boolean}
   */
  all: (input, rules, options) =>
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
  any: (input, rules, options) =>
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
  eq: (input, expectedValue) => input == expectedValue, // eslint-disable-line eqeqeq

  /**
   * Strict equality.
   *
   * @param {any} input
   * @param {any} expectedValue
   */
  eqs: (input, expectedValue) => input === expectedValue,

  /**
   * Greater than.
   *
   * @param {any} input
   * @param {any} value
   */
  gt: (input, value) => input > value,

  /**
   * Greater than or equals.
   *
   * @param {any} input
   * @param {any} value
   */
  gte: (input, value) => input >= value,

  /**
   * Less than.
   *
   * @param {any} input
   * @param {any} value
   */
  lt: (input, value) => input < value,

  /**
   * Less than or equals.
   *
   * @param {any} input
   * @param {any} value
   */
  lte: (input, value) => input <= value,

  /**
   * Input is inside a range.
   *
   * @param {any} input
   * @param {RangeRules} rules
   * @return {Boolean}
   */
  insideRange: (input, rules) =>
    has(rules, "min") &&
    has(rules, "max") &&
    input > rules.min &&
    input < rules.max,

  /**
   * Input is within a range.
   *
   * @param {any} input
   * @param {RangeRules} rules
   * @return {Boolean}
   */
  withinRange: (input, rules) =>
    has(rules, "min") &&
    has(rules, "max") &&
    input >= rules.min &&
    input <= rules.max,

  /**
   * Input is within the min value of a range (not including the max value).
   *
   * @param {any} input
   * @param {RangeRules} rules
   * @return {Boolean}
   */
  withinRangeMin: (input, rules) =>
    has(rules, "min") &&
    has(rules, "max") &&
    input >= rules.min &&
    input < rules.max,

  /**
   * Input is within the max value of a range (not including the min value).
   *
   * @param {any} input
   * @param {RangeRules} rules
   * @return {Boolean}
   */
  withinRangeMax: (input, rules) =>
    has(rules, "min") &&
    has(rules, "max") &&
    input > rules.min &&
    input <= rules.max,

  /**
   * Input is outside a range.
   *
   * @param {any} input
   * @param {RangeRules} rules
   * @return {Boolean}
   */
  outsideRange: (input, rules) =>
    has(rules, "min") &&
    has(rules, "max") &&
    input < rules.min &&
    input > rules.max,

  /**
   * Input is in outer range.
   *
   * @param {any} input
   * @param {RangeRules} rules
   * @return {Boolean}
   */
  outerRange: (input, rules) =>
    has(rules, "min") &&
    has(rules, "max") &&
    input <= rules.min &&
    input >= rules.max,

  /**
   * Input is outer range including the min value (not including the max value).
   *
   * @param {any} input
   * @param {RangeRules} rules
   * @return {Boolean}
   */
  outerRangeMin: (input, rules) =>
    has(rules, "min") &&
    has(rules, "max") &&
    input <= rules.min &&
    input > rules.max,

  /**
   * Input is outer range including the max value (not including the min value).
   *
   * @param {any} input
   * @param {RangeRules} rules
   * @return {Boolean}
   */
  outerRangeMax: (input, rules) =>
    has(rules, "min") &&
    has(rules, "max") &&
    input < rules.min &&
    input >= rules.max,

  /**
   * RegExp test.
   *
   * @param {any} input
   * @param {String|RegExp} re
   * @return {Boolean}
   */
  re: (input, re) => {
    let _re = re instanceof RegExp ? re : new RegExp(re);
    return _re.test(input);
  },

  /**
   * Check if input starts with a value.
   *
   * @param {String} input
   * @param {Number|String} value
   * @return {Boolean}
   */
  startsWith: (input, value) => {
    let _reStartsWith = new RegExp(`^${escapeRegExp(value)}`);
    return _reStartsWith.test(input + "");
  },

  /**
   * Check if input ends with a value.
   *
   * @param {String} input
   * @param {Number|String} value
   * @return {Boolean}
   */
  endsWith: (input, value) => {
    let _reStartsWith = new RegExp(`${escapeRegExp(value)}$`);
    return _reStartsWith.test(input + "");
  },

  /**
   * Check if input contains value.
   *
   * @param {String|Array} input
   * @param {any} value
   * @return {Boolean}
   */
  contains: (input, value) => input.indexOf(value) > -1,

  /**
   * Check if input is a specific type.
   *
   * @param {any} input
   * @param {CheckType} type
   * @return {Boolean}
   */
  type: (input, type) =>
    has(CHECK_TYPE, type, isFunction) && CHECK_TYPE[type].call(input, input),

  /**
   * Check if input has existence of one or many properties, or property
   * value is one or many possible values.
   *
   * @param {Object} input
   * @param {Object} props
   * @return {Boolean}
   */
  has: (input, props, options) => {
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

        // console.log("validationRule.has: object", {
        //   propName,
        //   propValue,
        //   matchType: options.matchAll ? "all" : "one"
        // });

        let arrayPropValue = castArray(propValue);
        let checkEachValueExists = castArray(props[propName]);

        // Match if all values are within
        if (has(options, "matchAll", isTruthy)) {
          isValid = allInArray(arrayPropValue, ...checkEachValueExists);
        }
        // Match if any values are within
        else {
          isValid = anyInArray(arrayPropValue, ...checkEachValueExists);
        }

        // console.log("validationRule.has", {
        //   arrayPropValue,
        //   checkEachValueExists,
        //   isValid
        // });

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
   *
   * @param {Object} input
   * @param {Object} props
   * @return {Boolean}
   */
  match: (input, props, options) => {
    let isValid = false;
    let countMatched = 0;
    let totalProps = 0;

    if (isObject(props)) {
      const propNames = Object.keys(props);
      totalProps = propNames.length;

      // Iterate through all the shallow props given
      for (let index = 0; index < totalProps; index++) {
        const propName = propNames[index];

        // Skip missing props
        if (
          has(options, "skipMissingProps", isTruthy) &&
          !has(input, propName) &&
          !has(options, `data.${propName}`)
        ) {
          totalProps--;
          continue;
        }

        const rules = props[propName];

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
 * You can also pass an options object to affect the rules.
 *
 * @param {Object} input
 * @param {ValidationRules} rules
 * @param {ValidationOptions} options
 */
export function validate(input, rules, options) {
  const _options = generateOptions({
    ...options,
    _depth: has(options, "_depth", isInteger) ? options._depth : 0
  });
  let totalRules = 1;
  let matchedRules = [];
  let countMatchedRules = 0;
  let isValid = false;

  const matchedRule = ({ ruleName, ruleValue, input, options, isValid }) => {
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
    isValid = rules.call(undefined, input, rules, _options);

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
      const ruleValue = rules[ruleName];

      // Use a custom function
      if (isFunction(ruleValue)) {
        isValid = ruleValue.call(undefined, input, ruleValue, _options);
      }
      // Use a validation rule
      else if (has(validationRules, ruleName, isFunction)) {
        isValid = validationRules[ruleName].call(
          undefined,
          input,
          ruleValue,
          _options
        );
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

  // if (has(_options, "debug", isTruthy)) {
  //   console.log("validate", {
  //     input,
  //     rules,
  //     options: _options,
  //     matchAll: _options.matchAll,
  //     negateMatch: _options.negateMatch,
  //     totalRules,
  //     countMatchedRules,
  //     isValid,
  //     output,
  //     matchedRules
  //   });
  // }

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
 */
