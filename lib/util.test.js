import * as util from "./util";

describe("util#has", () => {
  const testFn = function() {
    this.instanceProp = true;
  };
  testFn.staticProp = true;
  testFn.prototype.protoProp = true;

  const testFnInstance = new testFn();

  class TestClass {
    constructor() {
      this.instanceProp = true;
    }

    protoProp() {
      return true;
    }
  }

  TestClass.staticProp = true;

  const testClassInstance = new TestClass();

  it("should correctly find properties on a class function", () => {
    // This will only be available on the function instance
    expect(util.has(testFn, "instanceProp")).toBe(false);

    // This will only be available on the function itself
    expect(util.has(testFn, "staticProp")).toBe(true);

    // This will only be available on the function instance
    expect(util.has(testFn, "protoProp")).toBe(false);
  });

  it("should correctly find properties on a class function instance", () => {
    // This will only be available on the function instance
    expect(util.has(testFnInstance, "instanceProp")).toBe(true);

    // This will only be available on the function itself
    expect(util.has(testFnInstance, "staticProp")).toBe(false);

    // This will only be available on the function instance
    expect(util.has(testFnInstance, "protoProp")).toBe(true);
  });

  it("should correctly find properties on an ES6 class", () => {
    // This will only be available on the class instance
    expect(util.has(TestClass, "instanceProp")).toBe(false);

    // This will only be available on the class itself
    expect(util.has(TestClass, "staticProp")).toBe(true);

    // This will only be available on the class instance
    expect(util.has(TestClass, "protoProp")).toBe(false);
  });

  it("should correctly find properties on an ES6 class instance", () => {
    // This will only be available on the class instance
    expect(util.has(testClassInstance, "instanceProp")).toBe(true);

    // This will only be available on the class itself
    expect(util.has(testClassInstance, "staticProp")).toBe(false);

    // This will only be available on the class instance
    expect(util.has(testClassInstance, "protoProp")).toBe(true);
  });
});

it("util#isTruthy", () => {
  expect(util.isTruthy(true)).toBe(true);
  expect(util.isTruthy(1)).toBe(true);
  expect(util.isTruthy("string")).toBe(true);

  expect(util.isTruthy(undefined)).toBe(false);
  expect(util.isTruthy(null)).toBe(false);
  expect(util.isTruthy(false)).toBe(false);
  expect(util.isTruthy(0)).toBe(false);
});

it("util#isFalsy", () => {
  expect(util.isFalsy(true)).toBe(false);
  expect(util.isFalsy(1)).toBe(false);
  expect(util.isFalsy("string")).toBe(false);
  expect(util.isFalsy([])).toBe(false);
  expect(util.isFalsy({})).toBe(false);

  expect(util.isFalsy(undefined)).toBe(true);
  expect(util.isFalsy(null)).toBe(true);
  expect(util.isFalsy(false)).toBe(true);
  expect(util.isFalsy(0)).toBe(true);
});

it("util#isFloat", () => {
  expect(util.isFloat(0.1)).toBe(true);
  expect(util.isFloat(parseFloat("0.00001"))).toBe(true);

  expect(util.isFloat(NaN)).toBe(false);
  expect(util.isFloat(Infinity)).toBe(false);
  expect(util.isFloat(undefined)).toBe(false);
  expect(util.isFloat(null)).toBe(false);
  expect(util.isFloat(true)).toBe(false);
  expect(util.isFloat(1)).toBe(false);
  expect(util.isFloat(123456)).toBe(false);
});

it("util#anyInArray", () => {
  expect(util.anyInArray([true, false], true)).toBe(true);
  expect(util.anyInArray([1, 2, 3], 3)).toBe(true);
  expect(util.anyInArray(["a", "b", "c"], "e", "d", "c")).toBe(true);

  expect(util.anyInArray([true, false], 0)).toBe(false);
  expect(util.anyInArray([1, 2, 3], 4)).toBe(false);
  expect(util.anyInArray(["a", "b", "c"], "e")).toBe(false);
});

it("util#allInArray", () => {
  expect(util.allInArray([true, false], true)).toBe(true);
  expect(util.allInArray([1, 2, 3], 2, 3)).toBe(true);
  expect(util.allInArray(["a", "b", "c"], "a", "b", "c")).toBe(true);

  expect(util.allInArray([true, false], 0)).toBe(false);
  expect(util.allInArray([1, 2, 3], 1, 2, 3, 4)).toBe(false);
  expect(util.allInArray(["a", "b", "c"], "a", "b", "c", "d")).toBe(false);
});
