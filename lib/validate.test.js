import { validate, CHECK_TYPE } from "./validate";

const NOOP = () => {};
const ArrayLike = function() {
  this.length = 0;
};

let testItem = {
  name: "Matt Scheurich",
  age: 35,
  dob: "1983-09-12",
  country: "fr",
  languages: ["en", "fr"],
  petPreferences: {
    cat: true,
    dog: true,
    rat: false
  }
};

const testOptions = moreOptions => ({
  data: {
    locale: "en-UK",
    minimumAge: 16
  },
  ...moreOptions
});

describe("validate#_type", () => {
  let declaredVariableWithNoValueAssigned;
  let typeTests = {
    bool: {
      true: [true, false, Boolean(1)],
      false: [Boolean, undefined, null, 0, "", {}, [], NOOP, NaN, Infinity]
    },
    string: {
      true: ["", "string", String([1, 2, 3])],
      false: [
        String,
        undefined,
        null,
        0,
        true,
        false,
        {},
        [],
        NOOP,
        NaN,
        Infinity
      ]
    },
    number: {
      true: [0, 1, 1234.5678, Number("1"), Infinity, NaN],
      false: [Number, undefined, null, "", true, false, {}, [], NOOP]
    },
    integer: {
      true: [0, 1, 100, parseInt("10000", 10), Number("0")],
      false: [
        Number,
        Infinity,
        NaN,
        0.00001,
        undefined,
        null,
        "",
        "string",
        true,
        false,
        {},
        [],
        NOOP
      ]
    },
    float: {
      true: [0.1, parseFloat("-0.1111"), Number("1.45")],
      false: [
        Number,
        Infinity,
        NaN,
        0,
        1,
        undefined,
        null,
        "",
        "string",
        true,
        false,
        {},
        [],
        NOOP
      ]
    },
    array: {
      true: [[], new Array()],
      false: [
        Array,
        undefined,
        null,
        0,
        1,
        0.1,
        "",
        "string",
        true,
        false,
        {},
        NOOP,
        NaN,
        Infinity
      ]
    },
    arrayLike: {
      true: [[], new Array(), new ArrayLike(), "", "string"],
      false: [
        Array,
        ArrayLike,
        undefined,
        null,
        0,
        1,
        0.1,
        true,
        false,
        {},
        NOOP,
        NaN,
        Infinity
      ]
    },
    map: {
      true: [new Map()],
      false: [
        Map,
        undefined,
        null,
        0,
        1,
        0.1,
        "",
        "string",
        true,
        false,
        [],
        {},
        NOOP,
        NaN,
        Infinity
      ]
    },
    set: {
      true: [new Set()],
      false: [
        Set,
        undefined,
        null,
        0,
        1,
        0.1,
        "",
        "string",
        true,
        false,
        [],
        {},
        NOOP,
        NaN,
        Infinity
      ]
    },
    object: {
      true: [{}, [], NOOP],
      false: [undefined, null, 0, "", "string", true, false, NaN, Infinity]
    },
    objectLike: {
      true: [{}, [], new Set(), new Map(), new ArrayLike()],
      false: [
        undefined,
        null,
        0,
        1,
        0.1,
        "",
        "string",
        true,
        false,
        NOOP,
        NaN,
        Infinity
      ]
    },
    plainObject: {
      true: [{}],
      false: [
        undefined,
        null,
        0,
        1,
        0.1,
        "",
        "string",
        true,
        false,
        [],
        NaN,
        Infinity,
        NOOP,
        new ArrayLike(),
        new Set(),
        new Map()
      ]
    },
    function: {
      true: [NOOP, Set, Map, ArrayLike],
      false: [
        undefined,
        null,
        0,
        1,
        0.1,
        "",
        "string",
        true,
        false,
        NaN,
        Infinity,
        [],
        {},
        new ArrayLike(),
        new Set(),
        new Map()
      ]
    },
    regExp: {
      true: [/abc/, new RegExp()],
      false: [
        undefined,
        null,
        0,
        1,
        0.1,
        "",
        "string",
        true,
        false,
        NaN,
        Infinity,
        [],
        {},
        NOOP
      ]
    },
    date: {
      true: [new Date(), new Date("2018-10-31")],
      false: [
        Date,
        undefined,
        null,
        0,
        1,
        0.1,
        "",
        "string",
        true,
        false,
        NaN,
        Infinity,
        [],
        {},
        NOOP
      ]
    },
    null: {
      true: [null],
      false: [
        undefined,
        0,
        1,
        0.1,
        "",
        "string",
        true,
        false,
        NaN,
        Infinity,
        [],
        {},
        NOOP
      ]
    },
    undefined: {
      true: [
        undefined,
        declaredVariableWithNoValueAssigned,
        testItem.thisDoesNotExistOnObject
      ],
      false: [
        null,
        0,
        1,
        0.1,
        "",
        "string",
        true,
        false,
        NaN,
        Infinity,
        [],
        {},
        NOOP
      ]
    },
    nil: {
      true: [undefined, null],
      false: [0, 1, 0.1, "", "string", true, false, NaN, Infinity, [], {}, NOOP]
    },
    error: {
      true: [new Error(), new TypeError()],
      false: [
        undefined,
        0,
        1,
        "",
        "string",
        true,
        false,
        NaN,
        Infinity,
        [],
        {},
        NOOP
      ]
    },
    truthy: {
      true: [1, 0.1, "string", true, Infinity, [], {}, NOOP],
      false: [undefined, null, 0, "", false, NaN]
    },
    falsy: {
      true: [undefined, null, 0, "", false, NaN],
      false: [1, 0.1, "string", true, Infinity, [], {}, NOOP]
    }
  };

  Object.keys(typeTests).forEach(typeName =>
    Object.keys(typeTests[typeName]).forEach(expectedValue =>
      typeTests[typeName][expectedValue].forEach((testValue, index, arr) => {
        it(`${typeName}: should match ${expectedValue} against ${
          arr.length
        } values (test #${index + 1} of ${arr.length})`, () => {
          let testResult = validate(testValue, {
            type: typeName
          });

          // console.log("test response", {
          //   index,
          //   typeName,
          //   testValue,
          //   testResult,
          //   expectedValue: expectedValue === "true"
          // });

          expect(testResult).toBe(expectedValue === "true");
        });
      })
    )
  );
});

describe("validate#_has", () => {
  it("should validate if object has a single property", () => {
    expect(
      validate(testItem, {
        has: "name"
      })
    ).toBe(true);
  });

  it("should validate if object has any multiple properties", () => {
    expect(
      validate(testItem, {
        has: ["name", "age", "propDoesntExist"]
      })
    ).toBe(true);
  });

  it("should validate if object has all properties", () => {
    expect(
      validate(
        testItem,
        {
          has: ["name", "age"]
        },
        testOptions({
          matchAll: true
        })
      )
    ).toBe(true);
  });
});

describe("validate#_hasProps", () => {
  it("should validate if object has a single property", () => {
    expect(
      validate(
        testItem,
        {
          hasProps: "name"
        },
        testOptions()
      )
    ).toBe(true);
  });

  it("should validate if object has a single nested property", () => {
    expect(
      validate(
        testItem,
        {
          hasProps: "petPreferences.cat"
        },
        testOptions()
      )
    ).toBe(true);
  });

  it("should validate if object has multiple properties", () => {
    expect(
      validate(
        testItem,
        {
          hasProps: ["name", "age", "petPreferences.cat", "propDoesntExist"]
        },
        testOptions()
      )
    ).toBe(true);
  });

  it("should validate if object with non-array value given", () => {
    expect(
      validate(
        testItem,
        {
          hasProps: {
            languages: "en"
          }
        },
        testOptions()
      )
    ).toBe(true);
  });

  it("should validate if object with array of possible values given", () => {
    expect(
      validate(
        testItem,
        {
          hasProps: {
            languages: ["en", "valueDoesntExist"]
          }
        },
        testOptions()
      )
    ).toBe(true);
  });

  it("should validate if object with array of all values to match", () => {
    // Single property value that must match all values in specified array
    expect(
      validate(
        testItem,
        {
          hasProps: {
            languages: ["en", "fr"]
          }
        },
        testOptions({
          matchAll: true
        })
      )
    ).toBe(true);

    // Multiple property values with array that must match all
    expect(
      validate(
        testItem,
        {
          hasProps: {
            languages: ["en", "fr"],
            country: "fr"
          }
        },
        testOptions({
          matchAll: true
        })
      )
    ).toBe(true);
  });

  it("should validate if object with multiple props/values given", () => {
    expect(
      validate(
        testItem,
        {
          hasProps: {
            languages: ["en", "fr", "valueDoesntExist"],
            country: "fr",
            "petPreferences.cat": true,
            propDoesntExist: "valueDoesntExist"
          }
        },
        testOptions()
      )
    ).toBe(true);
  });
});

describe("documentation examples", () => {
  it("ValidationRules example #1: is object that does not have name and age properties", () => {
    let validateExample = input =>
      validate(input, {
        all: {
          type: "object",
          not: {
            hasProps: ["name", "age"]
          }
        }
      });

    expect(validateExample({})).toBe(true);
    expect(validateExample({ example: true })).toBe(true);

    expect(validateExample("{}")).toBe(false);
    expect(validateExample({ name: "Example" })).toBe(false);
    expect(validateExample({ age: 55 })).toBe(false);
    expect(validateExample({ name: "Example", age: 55 })).toBe(false);
  });

  it("ValidationRules example #2: has language 'fr' or 'de' and not language 'en'", () => {
    let validateExample = input =>
      validate(input, {
        all: {
          any: {
            hasProps: {
              language: ["fr", "de"]
            }
          },
          not: {
            hasProps: {
              language: "en"
            }
          }
        }
      });

    expect(validateExample({ language: ["en", "de"] })).toBe(false);
    expect(validateExample({ language: ["en", "fr"] })).toBe(false);
    expect(validateExample({ language: "en" })).toBe(false);

    expect(validateExample({ language: ["de", "fr"] })).toBe(true);
    expect(validateExample({ language: ["fr", "nl"] })).toBe(true);
    expect(validateExample({ language: ["de", "nl"] })).toBe(true);
    expect(validateExample({ language: ["de", "fr", "nl"] })).toBe(true);
    expect(validateExample({ language: "de" })).toBe(true);
    expect(validateExample({ language: "fr" })).toBe(true);
  });
});
