import { ValidationOptions, ValidationRules, ValidationRulesObject, ValidationRuleTypeFns } from "../lib/types";
/**
 * Default validate options.
 */
export declare const DEFAULT_OPTIONS: ValidationOptions;
/**
 * Factory to create {ValidationOptions} object.
 */
export declare const generateOptions: (options?: ValidationOptions) => ValidationOptions;
/**
 * Factory to create {ValidationOptions} object and auto-increment the depth.
 *
 * @param {ValidationOptions} options
 * @return {ValidationOptions}
 */
export declare const generateOptionsAndIncrementDepth: (options?: ValidationOptions) => ValidationOptions;
/**
 * Type checks and comparison functions.
 */
export declare const CHECK_TYPE: ValidationRuleTypeFns;
/**
 * The individual validation rules that can be uses.
 */
export declare const validationRules: ValidationRulesObject;
/**
 * Validate an object against a set of rules.
 *
 * You can also pass an options object to affect how rules are enforced.
 */
export declare function validate(input: any, rules: ValidationRules | any, options?: ValidationOptions): boolean;
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
