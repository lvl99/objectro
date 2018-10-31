import {
  isString,
  isArray,
  isPlainObject,
  isFunction,
  isNil,
  castArray
} from "lodash-es";

/**
 * Take an object and output another object with different property
 * names (shallow destructuring) and additionally formatting the value
 * (which can allow deeper destructuring).
 *
 * Functions can be used in object maps which can format the input object's
 * value:
 *
 * ```
 *   let input = {
 *     test1: 1,
 *     testB: "2",
 *     testC: "03,04,05"
 *   }
 *
 *   let output = {
 *     // Takes `test1` from input and puts it on the output as `testA`
 *     test1: "testA",
 *     // Takes `testB` from input and formats its value on the output as `testB`
 *     testB: value => parseInt(value, 10),
 *     // Takes `testC` from input and formats its value on the output as `testC`, `testD` and `testE`
 *     testC: value => {
 *       let [ testC, testD, testE ] = value.split(",").map(val => parseInt(val, 10));
 *       return {
 *         testC,
 *         testD,
 *         testE
 *       }
 *     }
 *   }
 *
 *   transformObject(input, output)
 *
 *   // Outputs:
 *   // {
 *   //   testA: 1,
 *   //   testB: 2,
 *   //   testC: 3,
 *   //   testD: 4,
 *   //   testE: 5
 *   // }
 * ```
 *
 * @param {Object} input
 * @param {...String|Object} props - Either a string take a single property or an object that maps a property on the input to a new property on the output
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
