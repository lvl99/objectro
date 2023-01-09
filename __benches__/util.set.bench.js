const lodashSet = require("lodash/set");
const objectPath = require("object-path");
const { set } = require("../dist/objectro.cjs.js");

const checkResult = (receivedValue, expectedValue) => {
  if (receivedValue !== expectedValue)
    throw new Error(
      `Received value does not equal expected value:\n\n` +
        `Received value: ${receivedValue}\n` +
        `Expected value: ${expectedValue}`
    );
};

suite("set shallow prop from object (using string)", () => {
  const input = { testA: 1 };
  const inputPath = "testA";

  test("lodash.set", () => {
    lodashSet(input, inputPath, "lodash.set");
    checkResult(input.testA, "lodash.set");
  });

  test("objectPath.set", () => {
    objectPath.set(input, inputPath, "objectPath.set");
    checkResult(input.testA, "objectPath.set");
  });

  test("set", () => {
    set(input, inputPath, "set");
    checkResult(input.testA, "set");
  });
});

suite("Set shallow prop from object (using array)", () => {
  const input = { testA: 1 };
  const inputPath = ["testA"];

  test("lodash.set", () => {
    lodashSet(input, inputPath, "lodash.set");
    checkResult(input.testA, "lodash.set");
  });

  test("objectPath.set", () => {
    objectPath.set(input, inputPath, "objectPath.set");
    checkResult(input.testA, "objectPath.set");
  });

  test("set", () => {
    set(input, inputPath, "set");
    checkResult(input.testA, "set");
  });
});

suite("Set nested prop from object (using string)", () => {
  const input = { testA: { testB: [1] } };
  const inputPath = "testA.testB[0]";

  test("lodash.set", () => {
    lodashSet(input, inputPath, "lodash.set");
    checkResult(input.testA.testB[0], "lodash.set");
  });

  test("objectPath.set", () => {
    objectPath.set(input, "testA.testB.0", "objectPath.set");
    checkResult(input.testA.testB[0], "objectPath.set");
  });

  test("set", () => {
    set(input, inputPath, "set");
    checkResult(input.testA.testB[0], "set");
  });
});

suite("Set nested prop from object (using array)", () => {
  const input = { testA: { testB: [1] } };
  const inputPath = ["testA", "testB", 0];

  test("lodash.set", () => {
    lodashSet(input, inputPath, "lodash.set");
    checkResult(input.testA.testB[0], "lodash.set");
  });

  test("objectPath.set", () => {
    objectPath.set(input, inputPath, "objectPath.set");
    checkResult(input.testA.testB[0], "objectPath.set");
  });

  test("set", () => {
    set(input, inputPath, "set");
    checkResult(input.testA.testB[0], "set");
  });
});

suite("Set deeply nested prop from object (using string)", () => {
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
  const inputPath =
    "testA.testB[0].testC.testD[0].testE.testF.testG.testH.testI.testJ.testK.testL.testM[2]";

  test("lodash.set", () => {
    lodashSet(input, inputPath, "lodash.set");
    checkResult(
      input.testA.testB[0].testC.testD[0].testE.testF.testG.testH.testI.testJ
        .testK.testL.testM[2],
      "lodash.set"
    );
  });

  test("objectPath.set", () => {
    objectPath.set(
      input,
      "testA.testB.0.testC.testD.0.testE.testF.testG.testH.testI.testJ.testK.testL.testM.2",
      "objectPath.set"
    );
    checkResult(
      input.testA.testB[0].testC.testD[0].testE.testF.testG.testH.testI.testJ
        .testK.testL.testM[2],
      "objectPath.set"
    );
  });

  test("set", () => {
    set(input, inputPath, "set");
    checkResult(
      input.testA.testB[0].testC.testD[0].testE.testF.testG.testH.testI.testJ
        .testK.testL.testM[2],
      "set"
    );
  });
});

suite("Set deeply nested prop from object (using array)", () => {
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
  const inputPath = [
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
  ];

  test("lodash.set", () => {
    lodashSet(input, inputPath, "lodash.set");
    checkResult(
      input.testA.testB[0].testC.testD[0].testE.testF.testG.testH.testI.testJ
        .testK.testL.testM[2],
      "lodash.set"
    );
  });

  test("objectPath.set", () => {
    objectPath.set(input, inputPath, "objectPath.set");
    checkResult(
      input.testA.testB[0].testC.testD[0].testE.testF.testG.testH.testI.testJ
        .testK.testL.testM[2],
      "objectPath.set"
    );
  });

  test("set", () => {
    set(input, inputPath, "set");
    checkResult(
      input.testA.testB[0].testC.testD[0].testE.testF.testG.testH.testI.testJ
        .testK.testL.testM[2],
      "set"
    );
  });
});
