import * as util from "../../lib/util";

interface TestHas {
  interfaceProp?: boolean;
  staticProp?: boolean;
  instanceProp?: boolean;
  protoProp?: boolean;
  prototype?: {
    [propName: string]: any;
    protoProp?: boolean;
  };
}

interface TestHasClass extends TestHas {
  constructor(): void;
}

declare interface TestClass {
  instanceProp: boolean | undefined;
  staticProp: boolean | undefined;
  protoProp(): boolean;
}

describe("util#get", () => {
  it("should get shallow prop from object (using string)", () => {
    expect(util.get({ testA: 1 }, "testA")).toBe(1);
  });

  it("should get shallow prop from array (using number)", () => {
    expect(util.get([1], 0)).toBe(1);
  });

  it("should get shallow prop from array (using string converted to number)", () => {
    expect(util.get([1], "0")).toBe(1);
  });

  it("should get shallow prop from object (using number as string)", () => {
    expect(util.get({ 0: 0, 1: 1 }, "1")).toBe(1);
    expect(util.get({ [`0`]: 0, [`1`]: 1 }, "1")).toBe(1);
  });

  it("should return default value if prop is invalid", () => {
    expect(util.get({ testA: 1 }, "", false)).toBe(false);
  });

  it("should return undefined if cannot get by prop (prop is not string or number)", () => {
    // @ts-ignore
    expect(util.get({ testA: 1 }, null)).toBe(undefined);
  });

  it("should get shallow prop from object (using array)", () => {
    expect(util.get({ testA: 1 }, ["testA"])).toBe(1);
  });

  it("should get nested prop from object (using string)", () => {
    expect(util.get({ testA: { testB: [1] } }, "testA.testB[0]")).toBe(1);
  });

  it("should get nested prop from object (using array)", () => {
    expect(util.get({ testA: { testB: [1] } }, ["testA", "testB", 0])).toBe(1);
  });

  it("should get deeply nested prop from object (using string)", () => {
    const input = {
      testA: {
        testB: [
          {
            testC: {
              testD: [
                {
                  testE: {
                    testF: {
                      testG: {
                        testH: {
                          testI: {
                            testJ: { testK: { testL: { testM: [1, 2, 3] } } }
                          }
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    };
    expect(
      util.get(
        input,
        "testA.testB[0].testC.testD[0].testE.testF.testG.testH.testI.testJ.testK.testL.testM[2]"
      )
    ).toBe(3);
  });

  it("should get deeply nested prop from object (using array)", () => {
    const input = {
      testA: {
        testB: [
          {
            testC: {
              testD: [
                {
                  testE: {
                    testF: {
                      testG: {
                        testH: {
                          testI: {
                            testJ: { testK: { testL: { testM: [1, 2, 3] } } }
                          }
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    };
    expect(
      util.get(input, [
        "testA",
        "testB",
        0,
        "testC",
        "testD",
        0,
        "testE",
        "testF",
        "testG",
        "testH",
        "testI",
        "testJ",
        "testK",
        "testL",
        "testM",
        2
      ])
    ).toBe(3);
  });
});

describe("util#set", () => {
  it("should set shallow prop from object (using string)", () => {
    const input = { testA: 1 };
    util.set(input, "testA", "util.set");
    expect(input.testA).toBe("util.set");
  });

  it("should get shallow prop from array (using number)", () => {
    const input = [0];
    util.set(input, 0, 1);
    expect(input[0]).toBe(1);
  });

  it("should get shallow prop from array (using string converted to number)", () => {
    const input = [0];
    util.set(input, "0", 1);
    expect(input[0]).toBe(1);
  });

  it("should get shallow prop from object (using number as string)", () => {
    const input = { 0: 0 };
    util.set(input, "0", 1);
    expect(input["0"]).toBe(1);
  });

  it("should not set if cannot get by prop (prop is not string or number)", () => {
    const input = { testA: 0 };
    // @ts-ignore
    util.set(input, null, 1);
    expect(input.testA).toBe(0);
  });

  it("should set new prop if it doesn't exist on object", () => {
    const input = { testA: 0 };
    util.set(input, "testB", 1);
    // @ts-ignore
    expect(input.testB).toBe(1);
  });

  it("should modify array if index doesn't exist in array", () => {
    const input = [0];
    util.set(input, 1, 1);
    expect(input[1]).toBe(1);

    util.set(input, 5, 5);
    expect(input[5]).toBe(5);
    expect(input[4]).toBeUndefined();
    expect(input[3]).toBeUndefined();
    expect(input[2]).toBeUndefined();
    expect(input[1]).toBe(1);
  });

  it("should set shallow prop from object (using array)", () => {
    const input = { testA: 1 };
    util.set(input, ["testA"], "My custom get function");
    expect(input.testA).toBe("My custom get function");
  });

  it("should set nested prop from object (using string)", () => {
    const input = { testA: { testB: [1] } };
    util.set(input, "testA.testB[0]", "util.set");
    expect(input.testA.testB[0]).toBe("util.set");
  });

  it("should set nested prop from object (using array)", () => {
    const input = { testA: { testB: [1] } };
    util.set(input, ["testA", "testB", 0], "util.set");
    expect(input.testA.testB[0]).toBe("util.set");
  });

  it("should set deeply nested prop from object (using string)", () => {
    const input = {
      testA: {
        testB: [
          {
            testC: {
              testD: [
                {
                  testE: {
                    testF: {
                      testG: {
                        testH: {
                          testI: {
                            testJ: { testK: { testL: { testM: [1, 2, 3] } } }
                          }
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    };

    util.set(
      input,
      "testA.testB[0].testC.testD[0].testE.testF.testG.testH.testI.testJ.testK.testL.testM[2]",
      "util.set"
    );
    expect(
      input.testA.testB[0].testC.testD[0].testE.testF.testG.testH.testI.testJ
        .testK.testL.testM[2]
    ).toBe("util.set");
  });

  it.only("should set deeply nested prop from object (using array)", () => {
    const input = {
      testA: {
        testB: [
          {
            testC: {
              testD: [
                {
                  testE: {
                    testF: {
                      testG: {
                        testH: {
                          testI: {
                            testJ: { testK: { testL: { testM: [1, 2, 3] } } }
                          }
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    };

    util.set(
      input,
      [
        "testA",
        "testB",
        0,
        "testC",
        "testD",
        0,
        "testE",
        "testF",
        "testG",
        "testH",
        "testI",
        "testJ",
        "testK",
        "testL",
        "testM",
        2
      ],
      "util.set"
    );
    expect(
      input.testA.testB[0].testC.testD[0].testE.testF.testG.testH.testI.testJ
        .testK.testL.testM[2]
    ).toBe("util.set");
  });
});

describe("util#has", () => {
  // @ts-ignore
  const testFn: TestHas = function() {
    // @ts-ignore
    this.instanceProp = true;
    // @ts-ignore
    return this;
  };
  testFn.staticProp = true;
  // @ts-ignore
  testFn.prototype.protoProp = true;
  // @ts-ignore
  const testFnInstance: TestHasClass = new testFn();

  class TestClass {
    constructor() {
      // @ts-ignore
      this.instanceProp = true;
    }
    get protoProp() {
      return true;
    }
  }
  // @ts-ignore
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
