const objectro = require("../dist/objectro.umd");

it("should be a valid objectro object", () => {
  expect(objectro).toHaveProperty("get");
  expect(objectro.get).toBeInstanceOf(Function);

  expect(objectro).toHaveProperty("set");
  expect(objectro.set).toBeInstanceOf(Function);

  expect(objectro).toHaveProperty("transform");
  expect(objectro.transform).toBeInstanceOf(Function);

  expect(objectro).toHaveProperty("validate");
  expect(objectro.validate).toBeInstanceOf(Function);

  // expect(objectro).not.toHaveProperty("default");
});
