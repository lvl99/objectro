import validate from "../../../lib/validate";

describe("validate#contains", () => {
  it("should match case insensitive value by default", () => {
    expect(
      validate(
        {
          propName: "ExactValue"
        },
        {
          match: {
            propName: {
              contains: "exactvalue"
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
              contains: "exactvalue"
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
              contains: "ExactValue"
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
