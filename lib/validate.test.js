import { validate } from "./validate";
import { isTruthy, isFalsy } from "./util";

const NOOP = () => {};
const ArrayLike = function() {
  this.length = 0;
};

let testItem = {
  name: "Matt Scheurich",
  dateOfBirth: "1983-04-17",
  age: 35,
  nationality: "nz",
  location: "fr",
  languages: ["en", "fr"],
  website: "https://www.lvl99.com",
  skills: {
    programming: [
      "html",
      "css",
      "javascript",
      "node",
      "frontend",
      "backend",
      "threejs"
    ],
    design: ["graphic", "publication", "typography", "illustration"],
    music: ["drums", "guitar", "production", "ableton"]
  },
  traits: ["positive", "helpful", "happy", "encouraging", "team member"]
};

const testOptions = moreOptions => ({
  data: {
    locale: "en-UK",
    minimumAge: 16
  },
  ...moreOptions
});

describe("validate#type", () => {
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

describe("validate#has", () => {
  it("should validate if object has a single property", () => {
    expect(
      validate(testItem, {
        has: "name"
      })
    ).toBe(true);
  });

  it("should validate if object has a single nested property", () => {
    expect(
      validate(testItem, {
        has: "skills.programming"
      })
    ).toBe(true);
  });

  it("should validate if object has any of the specified properties", () => {
    expect(
      validate(testItem, {
        has: ["name", "age", "skills.programming", "propDoesntExist"]
      })
    ).toBe(true);

    expect(
      validate(testItem, {
        has: ["propDoesntExist", "anotherPropDoesntExist"]
      })
    ).toBe(false);
  });

  it("should validate if object has all specified properties", () => {
    expect(
      validate(testItem, {
        all: {
          has: ["name", "age", "skills.programming"]
        }
      })
    ).toBe(true);

    expect(
      validate(testItem, {
        all: {
          has: ["name", "age", "skills.programming", "propDoesntExist"]
        }
      })
    ).toBe(false);
  });

  it("should validate if object property has any of the specified values", () => {
    expect(
      validate(testItem, {
        has: {
          languages: "en"
        }
      })
    ).toBe(true);

    expect(
      validate(testItem, {
        has: {
          languages: ["en", "fr"]
        }
      })
    ).toBe(true);

    expect(
      validate(testItem, {
        has: {
          languages: ["de", "nl", "ja"]
        }
      })
    ).toBe(false);
  });
});

describe("validate#match", () => {
  it("should apply rule objects to each property", () => {
    expect(
      validate(testItem, {
        match: {
          name: {
            type: "string",
            startsWith: "Matt"
          },
          age: {
            gt: 18
          },
          skills: {
            all: {
              has: ["programming.javascript", "programming.node"]
            }
          }
        }
      })
    ).toBe(true);
  });

  it("should match non-existent props", () => {
    expect(
      validate(testItem, {
        match: {
          propDoesntExist: isFalsy
        }
      })
    ).toBe(true);
  });
});

describe("documentation examples", () => {
  it("detailed object validation", () => {
    expect(
      validate(
        testItem,
        {
          all: {
            has: {
              languages: "en",
              "skills.programming": ["html", "css", "javascript", "frontend"]
            },
            any: {
              has: ["name", "age", "location"]
            },
            not: {
              has: {
                traits: ["negative", "downer"]
              }
            }
          }
        },
        { debug: true }
      )
    ).toBe(true);
  });

  it("ValidationRules example #1: is object that does not have name and age properties", () => {
    let validateExample = input =>
      validate(input, {
        all: {
          type: "object",
          not: {
            has: ["name", "age"]
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
            has: {
              language: ["fr", "de"]
            }
          },
          not: {
            has: {
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
