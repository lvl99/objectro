import objectro from "../dist/objectro";
import { transform, validate } from "../dist/objectro";
const objectroReference = require("../dist/objectro");

it("should be importable ES6", () => {
  expect(objectro).toBe(objectroReference.default);
  expect(transform).toBe(objectroReference.transform);
  expect(validate).toBe(objectroReference.validate);
});
