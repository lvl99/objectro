import validate from "../../../lib/validate";

describe("validate#endsWith", () => {
  it("should match case insensitive value by default", () => {
    expect(
      validate(
        {
          propName: "ExactValue"
        },
        {
          match: {
            propName: {
              endsWith: "value"
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
              endsWith: "value"
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
              endsWith: "Value"
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
