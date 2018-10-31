import { validate, CHECK_TYPE } from "./validate";

const NOOP = () => {};

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

/*
describe("validate#_type", () => {
  let typeTests = {
    bool: {
      true: [true, false, Boolean(1)],
      false: [undefined, null, 0, "", {}, [], NOOP, NaN, Infinity]
    },
    string: {
      true: ["", "something", String([1, 2, 3])],
      false: [undefined, null, 0, true, false, {}, [], NOOP, NaN, Infinity]
    },
    number: {
      true: [0, 1, 1234.5678, Number("1"), Infinity, NaN],
      false: [undefined, null, "", true, false, {}, [], NOOP]
    },
    integer: {
      true: [100, parseInt("10000", 10), Number("0")],
      false: [
        Infinity,
        NaN,
        0.00001,
        undefined,
        null,
        "",
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
        Infinity,
        NaN,
        100,
        undefined,
        null,
        "",
        true,
        false,
        {},
        [],
        NOOP
      ]
    },
    array: {
      true: [[], [1, 2, 3]],
      false: [undefined, null, 0, "", true, false, {}, NOOP, NaN, Infinity]
    }
  };

  Object.keys(typeTests).forEach(typeName =>
    Object.keys(typeTests[typeName]).forEach(expectedValue =>
      typeTests[typeName][expectedValue].forEach((testValue, index, arr) => {
        it(`should match ${typeName} against ${
          arr.length
        } values and all be ${expectedValue} (${index + 1}/${
          arr.length
        })`, () => {
          let testResult = validate(testValue, {
            _type: typeName
          });

          console.log("test response", {
            index,
            typeName,
            testValue,
            testResult,
            expectedValue: expectedValue === "true"
          });

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
        _has: "name"
      })
    ).toBe(true);
  });

  it("should validate if object has any multiple properties", () => {
    expect(
      validate(testItem, {
        _has: ["name", "age", "propDoesntExist"]
      })
    ).toBe(true);
  });

  it("should validate if object has all properties", () => {
    expect(
      validate(
        testItem,
        {
          _has: ["name", "age"]
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
          _hasProps: "name"
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
          _hasProps: "petPreferences.cat"
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
          _hasProps: ["name", "age", "petPreferences.cat", "propDoesntExist"]
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
          _hasProps: {
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
          _hasProps: {
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
          _hasProps: {
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
          _hasProps: {
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
          _hasProps: {
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
*/

describe("documentation examples", () => {
  it("ValidationRules example #1: is object that does not have name and age properties", () => {
    let validateExample = input =>
      validate(input, {
        _all: {
          _type: "object",
          _not: {
            _hasProps: ["name", "age"]
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
        _all: {
          _any: {
            _hasProps: {
              language: ["fr", "de"]
            }
          },
          _not: {
            _hasProps: {
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
