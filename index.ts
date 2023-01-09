import { get as libGet, set as libSet } from "./lib/util";
import libTransform from "./lib/transform";
import libValidate from "./lib/validate";

export const get = libGet;
export const set = libSet;
export const transform = libTransform;
export const validate = libValidate;

export default {
  get,
  set,
  transform,
  validate
};
