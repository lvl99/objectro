const lodashGet = require("lodash/get");
const objectPath = require("object-path");
const { get } = require("../dist/objectro.cjs.js");

const checkResult = (receivedValue, expectedValue) => {
  if (receivedValue !== expectedValue)
    throw new Error(
      `Received value does not equal expected value:\n\n` +
        `Received value: ${receivedValue}\n` +
        `Expected value: ${expectedValue}`
    );
};

const testObject = {
  testA: {
    testB: {
      testC: {
        testD: [
          {
            testE: true
          },
          {
            testF: {
              testG: {
                testH: {
                  testI: {
                    testJ: {
                      testK: {
                        testL: {
                          testM: [false, false, true]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    }
  }
};

suite("Get shallow prop from object (using string)", () => {
  test("lodash.get", () => {
    checkResult(lodashGet(testObject, "testA"), testObject.testA);
  });

  test("objectPath.get", () => {
    checkResult(objectPath.get(testObject, "testA"), testObject.testA);
  });

  test("get", () => {
    checkResult(get(testObject, "testA"), testObject.testA);
  });
});

suite("Get shallow prop from object (using array)", () => {
  test("lodash.get", () => {
    checkResult(lodashGet(testObject, ["testA"]), testObject.testA);
  });

  test("objectPath.get", () => {
    checkResult(objectPath.get(testObject, ["testA"]), testObject.testA);
  });

  test("get", () => {
    checkResult(get(testObject, ["testA"]), testObject.testA);
  });
});

suite("Get nested prop from object (using string)", () => {
  test("lodash.get", () => {
    checkResult(
      lodashGet(testObject, "testA.testB.testC.testD[0].testE"),
      testObject.testA.testB.testC.testD[0].testE
    );
  });

  test("objectPath.get", () => {
    checkResult(
      objectPath.get(testObject, "testA.testB.testC.testD.0.testE"),
      testObject.testA.testB.testC.testD[0].testE
    );
  });

  test("get", () => {
    checkResult(
      get(testObject, "testA.testB.testC.testD[0].testE"),
      testObject.testA.testB.testC.testD[0].testE
    );
  });
});

suite("Get nested prop from object (using array)", () => {
  const inputPath = ["testA", "testB", "testC", "testD", 0, "testE"];

  test("lodash.get", () => {
    checkResult(
      lodashGet(testObject, inputPath),
      testObject.testA.testB.testC.testD[0].testE
    );
  });

  test("objectPath.get", () => {
    checkResult(
      objectPath.get(testObject, inputPath),
      testObject.testA.testB.testC.testD[0].testE
    );
  });

  test("get", () => {
    checkResult(
      get(testObject, inputPath),
      testObject.testA.testB.testC.testD[0].testE
    );
  });
});

suite("Get deeply nested prop from object (using string)", () => {
  test("lodash.get", () => {
    checkResult(
      lodashGet(
        testObject,
        "testA.testB.testC.testD[1].testF.testG.testH.testI.testJ.testK.testL.testM[2]"
      ),
      testObject.testA.testB.testC.testD[1].testF.testG.testH.testI.testJ.testK
        .testL.testM[2]
    );
  });

  test("objectPath.get", () => {
    checkResult(
      objectPath.get(
        testObject,
        "testA.testB.testC.testD.1.testF.testG.testH.testI.testJ.testK.testL.testM.2"
      ),
      testObject.testA.testB.testC.testD[1].testF.testG.testH.testI.testJ.testK
        .testL.testM[2]
    );
  });

  test("get", () => {
    checkResult(
      get(
        testObject,
        "testA.testB.testC.testD[1].testF.testG.testH.testI.testJ.testK.testL.testM[2]"
      ),
      testObject.testA.testB.testC.testD[1].testF.testG.testH.testI.testJ.testK
        .testL.testM[2]
    );
  });
});

suite("Get deeply nested prop from object (using array)", () => {
  const inputPath = [
    "testA",
    "testB",
    "testC",
    "testD",
    1,
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

  test("lodash.get", () => {
    checkResult(
      lodashGet(testObject, inputPath),
      testObject.testA.testB.testC.testD[1].testF.testG.testH.testI.testJ.testK
        .testL.testM[2]
    );
  });

  test("objectPath.get", () => {
    checkResult(
      objectPath.get(testObject, inputPath),
      testObject.testA.testB.testC.testD[1].testF.testG.testH.testI.testJ.testK
        .testL.testM[2]
    );
  });

  test("get", () => {
    checkResult(
      get(testObject, inputPath),
      testObject.testA.testB.testC.testD[1].testF.testG.testH.testI.testJ.testK
        .testL.testM[2]
    );
  });
});
