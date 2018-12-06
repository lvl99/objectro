import objectro from "../dist/objectro";
import { transform, validate } from "../dist/objectro";
const objectroReference = require("../dist/objectro");

it("should be importable ES6", () => {
  expect(objectro).toMatchObject({
    transform: objectroReference.transform,
    validate: objectroReference.validate
  });
  expect(transform).toBe(objectroReference.transform);
  expect(validate).toBe(objectroReference.validate);
});
