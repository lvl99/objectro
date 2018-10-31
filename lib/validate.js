import {
  escapeRegExp,
  castArray,
  isBoolean,
  isString,
  isNumber,
  isInteger,
  isArray,
  isArrayLike,
  isMap,
  isSet,
  isObject,
  isObjectLike,
  isPlainObject,
  isFunction,
  isRegExp,
  isDate,
  isNull,
  isUndefined,
  isNaN,
  isNil,
  isError,
  isNative
} from "lodash-es";
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
  negateMatch: false,
  matchAll: false
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
  native: isNative,
  truthy: isTruthy,
  falsy: isFalsy
};

/**
 * The validation rules that can be applied.
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
  _not: (input, rules, options) =>
    validate(
      input,
      rules,
      generateOptionsAndIncrementDepth({
        ...options,
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
  _all: (input, rules, options) =>
    validate(
      input,
      rules,
      generateOptionsAndIncrementDepth({
        ...options,
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
  _any: (input, rules, options) =>
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
  _eq: (input, expectedValue) => input == expectedValue, // eslint-disable-line eqeqeq

  /**
   * Strict equality.
   *
   * @param {any} input
   * @param {any} expectedValue
   */
  _eqs: (input, expectedValue) => input === expectedValue,

  /**
   * Greater than.
   *
   * @param {any} input
   * @param {any} value
   */
  _gt: (input, value) => input > value,

  /**
   * Greater than or equals.
   *
   * @param {any} input
   * @param {any} value
   */
  _gte: (input, value) => input >= value,

  /**
   * Less than.
   *
   * @param {any} input
   * @param {any} value
   */
  _lt: (input, value) => input < value,

  /**
   * Less than or equals.
   *
   * @param {any} input
   * @param {any} value
   */
  _lte: (input, value) => input <= value,

  /**
   * Input is inside a range.
   *
   * @param {any} input
   * @param {RangeRules} rules
   * @return {Boolean}
   */
  _insideRange: (input, rules) =>
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
  _withinRange: (input, rules) =>
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
  _withinRangeMin: (input, rules) =>
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
  _withinRangeMax: (input, rules) =>
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
  _outsideRange: (input, rules) =>
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
  _outerRange: (input, rules) =>
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
  _outerRangeMin: (input, rules) =>
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
  _outerRangeMax: (input, rules) =>
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
  _re: (input, re) => {
    let _re = re instanceof RegExp ? re : new RegExp(re);
    return _re.test(input);
  },

  /**
   * Check if input starts with a value.
   *
   * @param {String} input
   * @param {String|RegExp} value
   * @return {Boolean}
   */
  _startsWith: (input, value) => {
    let _reStartsWith = new RegExp(`^${escapeRegExp(value)}`);
    return _reStartsWith.test(input + "");
  },

  /**
   * Check if input ends with a value (number, string or RegExp).
   *
   * @param {String} input
   * @param {Number|String|RegExp} value
   * @return {Boolean}
   */
  _endsWith: (input, value) => {
    let _reStartsWith = new RegExp(`${escapeRegExp(value)}$`);
    return _reStartsWith.test(input + "");
  },

  /**
   * Check if input contains value (number, string or RegExp).
   *
   * @param {String|Array} input
   * @param {Number|String} value
   * @return {Boolean}
   */
  _contains: (input, value) => input.indexOf(value) > -1,

  /**
   * Check if input is a specific type.
   *
   * @param {any} input
   * @param {CheckType} type
   * @return {Boolean}
   */
  _type: (input, type) =>
    has(CHECK_TYPE, type, isFunction) && CHECK_TYPE[type].call(input, input),

  /**
   * Check if input has one, any or all properties.
   *
   * @param {Object} input
   * @param {String|Array} props
   * @return {Boolean}
   */
  _has: (input, props, options) => {
    let isValid = false;

    // Array
    if (isArray(props)) {
      let totalProps = props.length;

      // Match only if all properties exist
      if (has(options, "matchAll", isTruthy)) {
        let countHas = 0;
        for (let index = 0; index < totalProps; index++) {
          countHas += has(input, props[index]) ? 1 : 0;
        }
        // console.log("has all: array of props", { totalProps, countHas });
        isValid = countHas === totalProps;
      }
      // Match if any one property exists
      else {
        // console.log("has any: array of props", { totalProps });
        for (let index = 0; index < totalProps; index++) {
          if (has(input, props[index])) {
            isValid = true;
            break;
          }
        }
      }
    } else {
      // String
      isValid = has(input, props);
    }

    // console.log("has", { input, props, options, isValid });

    return isValid;
  },

  /**
   * Check if input matches the property names and values within an object.
   *
   * @param {Object} input
   * @param {Object} values
   * @return {Boolean}
   */
  _hasProps: (input, values, options) => {
    // Check if has multiple props
    if (isString(values) || isArray(values)) {
      return validate(input, { _has: values });
    }
    // Check if has props with specific values
    else if (isObject(values)) {
      let isValid = false;
      let totalValues = Object.keys(values).length;
      let countMatched = 0;

      // Iterate through all the shallow props given
      for (let propName in values) {
        if (!has(input, propName)) {
          continue;
        }

        let checkInput =
          isArray(input) || has(input, propName)
            ? input[propName]
            : has(options, ["data", propName])
              ? options.data[propName]
              : undefined;

        if (checkInput !== undefined) {
          let arrayCheckInput = castArray(checkInput);
          let checkEachValue = castArray(values[propName]);

          // Match if all values are within
          if (has(options, "matchAll", isTruthy)) {
            isValid = allInArray(arrayCheckInput, ...checkEachValue);
          }
          // Match if any values are within
          else {
            isValid = anyInArray(arrayCheckInput, ...checkEachValue);
          }

          if (isValid) {
            countMatched++;

            if (has(options, "matchAll", isTruthy)) {
              isValid = countMatched === totalValues;
            } else {
              break;
            }
          }
        }
      }

      // console.log("hasProps: is plain object", {
      //   totalValues,
      //   countMatched,
      //   isValid
      // });

      return isValid;
    }
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
  const totalRules = Object.keys(rules).length;
  const _options = generateOptions({
    ...options,
    _depth: has(options, "_depth", isInteger) ? options._depth : 0
  });
  let matchedRules = [];
  let countMatchedRules = 0;
  let isValid = false;

  for (let ruleName in rules) {
    if (!has(rules, ruleName)) {
      continue;
    }

    const rule = rules[ruleName];

    if (has(validationRules, ruleName)) {
      isValid = validationRules[ruleName].call(input, input, rule, _options);
    }

    // console.log("check if validation matched", {
    //   ruleName,
    //   isValid,
    //   expectedIsValid: !_options.negateMatch,
    //   successfulMatch: isValid === !_options.negateMatch
    // });

    if (isValid) {
      matchedRules.push({
        ruleName,
        input,
        rule,
        options: _options,
        isValid
      });
      countMatchedRules++;

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
    }
  }

  const output = has(_options, "negateMatch", isTruthy) ? !isValid : isValid;

  // console.log("validate", {
  //   input,
  //   rules,
  //   options: _options,
  //   totalRules,
  //   countMatchedRules,
  //   isValid,
  //   output,
  //   matchedRules
  // });

  return output;
}

export default validate;

/**
 * An object which contains the validation rules to apply.
 *
 * Validation rules can be nested within validation rules and also modified.
 *
 * You can also change the behaviour of some rules' matching capabilities:
 *   - `_any`: match any rule given (this is the default behaviour)
 *   - `_all`: match all rules given
 *   - `_not`: negate the returned value
 *
 * The following example would return `true` if the input value is an object
 * and does not have `name` and `age` as properties:
 *
 * ```js
 *   validate(exampleObject, {
 *     _all: {
 *       _type: "object",
 *       _not: {
 *         _hasProps: ["name", "age"]
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
 * `_hasProps` can match to an exact value or can match multiple values by using
 * an array.
 *
 * ```js
 *   validate(exampleObject, {
 *     _all: {
 *       _any: {
 *         _hasProps: {
 *           language: ["fr", "de"]
 *         },
 *       },
 *       _not: {
 *         _hasProps: {
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
 */
