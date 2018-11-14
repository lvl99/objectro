import isString from "lodash/isString";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import isFunction from "lodash/isFunction";
import isNil from "lodash/isNil";
import castArray from "lodash/castArray";

/**
 * Take an object and output another object with different property
 * names (shallow destructuring) and additionally formatting the value
 * (which can allow deeper destructuring).
 *
 * Functions can be used in object maps which can format the input object's
 * value.
 *
 * @param {Object} input
 * @param {...String|Object|Function|TransformMap} props
 * @return {Object}
 */
export function transform(input, ...props) {
  let immutableInput = Object.freeze({ ...input });
  let output = {};

  if (!props || !props.length) {
    return { ...input };
  }

  props.forEach(processProps => {
    // A string represents a name from the input to map to the output
    if (isString(processProps)) {
      output[processProps] = !isNil(input[processProps])
        ? input[processProps]
        : output[processProps];
    }
    // An object represents a map from the input structure to a new structure
    else if (isPlainObject(processProps)) {
      Object.keys(processProps).forEach(propName => {
        // Original value
        let inputValue = input[propName];

        // New name for prop on output object or a function to format the input
        // object's value
        let outputProp = processProps[propName];

        // Format value using function
        if (isFunction(outputProp)) {
          // Use the input as the context and pass the value, propName
          // and the output object as parameters.
          // The function should return an object which will then be merged
          // into the output object.
          // We also prevent the function from mutating the input object
          // by making a copy of the input object and freezing it.
          let outputValue = outputProp.call(
            immutableInput,
            inputValue,
            propName,
            immutableInput,
            output
          );

          // If a function doesn't return anything, then we assume the function
          // has done the necessary manipulations to the output object itself
          if (outputValue !== undefined) {
            if (isPlainObject(outputValue)) {
              output = {
                ...output,
                ...outputValue
              };
            } else {
              output[propName] = outputValue;
            }
          }
        }
        // Nested object map on the same prop name
        else if (
          isPlainObject(inputValue) &&
          (isPlainObject(outputProp) || isArray(outputProp))
        ) {
          output[propName] = transform(inputValue, ...castArray(outputProp));
        }
        // Map input value to new prop in output
        else if (isString(outputProp)) {
          output[outputProp] = !isNil(inputValue)
            ? inputValue
            : output[outputProp];
        }
      });
    }
  });

  return output;
}

export default transform;

/**
 * @typedef {Object} TransformMap
 */
