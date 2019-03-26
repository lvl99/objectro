const { validate } = require("../../../lib/validate");

describe("validate#startsWith", () => {
  it("should match case insensitive value by default", () => {
    expect(
      validate(
        {
          propName: "ExactValue"
        },
        {
          match: {
            propName: {
              startsWith: "exact"
            }
          }
        }
      )
    ).toBe(true);
  });

  it("should match case insensitive value when caseSensitive = false", () => {
    expect(
      validate(
        {
          propName: "ExactValue"
        },
        {
          match: {
            propName: {
              startsWith: "exact"
            }
          }
        },
        {
          caseSensitive: false
        }
      )
    ).toBe(true);
  });

  it("should match exact value when caseSensitive = true", () => {
    expect(
      validate(
        {
          propName: "ExactValue"
        },
        {
          match: {
            propName: {
              startsWith: "Exact"
            }
          }
        },
        {
          caseSensitive: true
        }
      )
    ).toBe(true);
  });
});
