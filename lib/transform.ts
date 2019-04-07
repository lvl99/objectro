import get from "lodash/get";
import set from "lodash/set";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import isFunction from "lodash/isFunction";
import castArray from "lodash/castArray";
import { POJO, TransformFn } from "..";
import { has, isEmpty } from "./util";

const useInputOrOutputValue = (
  propName: string,
  input: any,
  output: any
): any =>
  has(input, propName) && !isEmpty(get(input, propName))
    ? get(input, propName)
    : get(output, propName);

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
export function transform(input: any, ...props: any[]): any {
  let immutableInput = Object.freeze({ ...input });
  let output: POJO = {};

  if (!props || !props.length) {
    return { ...input };
  }

  props.forEach(
    (processProps): void => {
      // A string represents a name from the input to map to the output
      if (isString(processProps)) {
        let useValue = useInputOrOutputValue(processProps, input, output);
        if (useValue !== undefined) {
          set(output, processProps, useValue);
        }
      }
      // An object represents a map from the input structure to a new structure
      else if (isPlainObject(processProps)) {
        Object.keys(processProps).forEach(
          (propName): void => {
            // Original value
            let useValue = useInputOrOutputValue(propName, input, output);

            // New name for prop on output object or a function to format the input
            // object's value
            let outputProp = get(processProps, propName);

            // console.log("objectro.transform output snapshot", {
            //   input,
            //   output: { ...output },
            //   propName,
            //   useValue,
            //   outputProp
            // });

            // Format value using function
            if (isFunction(outputProp)) {
              // Use the input as the context and pass the value, propName
              // and the output object as parameters.
              // The function should return an object which will then be merged
              // into the output object.
              // We also prevent the function from mutating the input object
              // by making a copy of the input object and freezing it.
              let outputValue = (outputProp as TransformFn)(
                useValue,
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
                  set(output, propName, outputValue);
                }
              }
            }
            // Nested transform map on nested input objects
            else if (
              isPlainObject(useValue) &&
              (isPlainObject(outputProp) || isArray(outputProp))
            ) {
              set(
                output,
                propName,
                transform(useValue, ...castArray(outputProp))
              );
            }
            // Map input value to new prop in output
            else if (isString(outputProp) && useValue !== undefined) {
              set(output, outputProp, useValue);
            }
          }
        );
      }
    }
  );

  return output;
}

export default transform;

/**
 * @typedef {Object} TransformMap
 */
