const objectro = require("../dist/objectro");

it("should be a valid objectro object", () => {
  expect(objectro).toHaveProperty("transform");
  expect(objectro.transform).toBeInstanceOf(Function);

  expect(objectro).toHaveProperty("validate");
  expect(objectro.validate).toBeInstanceOf(Function);

  expect(objectro).toHaveProperty("default");
  expect(objectro.default).toHaveProperty("transform", objectro.transform);
  expect(objectro.default).toHaveProperty("validate", objectro.validate);
});
