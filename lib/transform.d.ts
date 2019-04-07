/**
 * Take an object and output another object with different property
 * names (shallow destructuring) and additionally formatting the value
 * (which can allow deeper destructuring).
 *
 * Functions can be used in object maps which can format the input object's
 * value.
 *
 * Transform can also return non-object values.
 */
export declare function transform(input: any, ...props: any[]): any;
export default transform;
/**
 * @typedef {Object} TransformMap
 */
