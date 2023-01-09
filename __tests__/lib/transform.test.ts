import { POJO, TransformFn } from "../../lib/types";
import transform from "../../lib/transform";

let testItem: POJO = {
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

describe("transform", () => {
  it("should pluck only shallow property names given as params", () => {
    let transformedItem = transform(testItem, "name", "age", "dob");
    expect(Object.keys(transformedItem)).toHaveLength(3);
    expect(transformedItem).toHaveProperty("name", testItem.name);
    expect(transformedItem).toHaveProperty("age", testItem.age);
    expect(transformedItem).toHaveProperty("dob", testItem.dob);
  });

  it("should map input property names to output property names", () => {
    let transformedItem = transform(testItem, {
      name: "fullName",
      age: "ageInYears",
      dob: "dateOfBirth"
    });
    expect(Object.keys(transformedItem)).toHaveLength(3);
    expect(transformedItem).toHaveProperty("fullName", testItem.name);
    expect(transformedItem).toHaveProperty("ageInYears", testItem.age);
    expect(transformedItem).toHaveProperty("dateOfBirth", testItem.dob);
  });

  it("should process maps on nested objects", () => {
    let addIfTruthy = (newPropName: string): TransformFn => value =>
      value ? { [newPropName]: value } : undefined;
    let transformedItemA = transform(testItem, {
      petPreferences: {
        cat: "cats",
        dog: addIfTruthy("dogs"),
        rat: addIfTruthy("rats")
      }
    });
    expect(transformedItemA).toHaveProperty("petPreferences");
    expect(transformedItemA.petPreferences).toMatchObject({
      cats: testItem.petPreferences.cat,
      dogs: testItem.petPreferences.dog
    });
    expect(transformedItemA.petPreferences).not.toHaveProperty("rats");

    // Use an array to pass in string prop names
    let transformedItemB = transform(testItem, {
      petPreferences: [
        "cat",
        {
          dog: "dogs"
        },
        {
          rat: (value: any) => ({ rats: value })
        }
      ]
    });
    expect(transformedItemB).toHaveProperty("petPreferences");
    expect(transformedItemB.petPreferences).toMatchObject({
      cat: testItem.petPreferences.cat,
      dogs: testItem.petPreferences.dog,
      rats: testItem.petPreferences.rat
    });
  });

  it("should map input property name using returned value of formatted function", () => {
    let transformedItem = transform(testItem, {
      name: (value: any) => value.split(" "),
      age: (value: any) => `${value}`,
      dob: (value: any) => {
        let date = new Date(value);
        return {
          dob: date,
          dateOfBirth: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
          }
        };
      }
    });
    expect(Object.keys(transformedItem)).toHaveLength(4);
    expect(transformedItem).toHaveProperty("name");
    expect(transformedItem.name).toBeInstanceOf(Array);
    expect(transformedItem.name).toHaveLength(2);
    expect(transformedItem).toHaveProperty("age", `${testItem.age}`);
    expect(transformedItem).toHaveProperty("dob");
    expect(transformedItem.dob).toBeInstanceOf(Date);
    expect(transformedItem).toHaveProperty("dateOfBirth");
    expect(transformedItem.dateOfBirth).toHaveProperty("year", 1983);
    expect(transformedItem.dateOfBirth).toHaveProperty("month", 9);
    expect(transformedItem.dateOfBirth).toHaveProperty("day", 12);
  });

  it("should mix both string args and object map args when formatting an object", () => {
    let transformedItem = transform(
      testItem,
      {
        name: "fullName",
        age: "ageInYears",
        dob: (value: any) => ({
          dateOfBirth: new Date(value)
        }),
        notFoundOnInputObject: (
          value: any,
          propName: string,
          input: POJO,
          output: POJO
        ) => {
          output.newProp = true;
        }
      },
      "country",
      "languages"
    );
    expect(Object.keys(transformedItem)).toHaveLength(6);
    expect(transformedItem).toHaveProperty("fullName", testItem.name);
    expect(transformedItem).toHaveProperty("ageInYears", testItem.age);
    expect(transformedItem).toHaveProperty("dateOfBirth");
    expect(transformedItem.dateOfBirth).toBeInstanceOf(Date);
    expect(transformedItem).toHaveProperty("country", testItem.country);
    expect(transformedItem).toHaveProperty("languages", testItem.languages);
    expect(transformedItem).toHaveProperty("newProp", true);
  });

  it("should pass the correct param values for format functions", () => {
    const transformedObject = transform(testItem, {
      name(value: any, propName: string, input: POJO, output: POJO) {
        expect(input).toHaveProperty(propName, value);
        expect(value).toBe(testItem.name);
        expect(propName).toBe("name");
        expect(output).toMatchObject({});
        return value;
      },
      age(value: any, propName: string, input: POJO, output: POJO) {
        expect(input).toHaveProperty(propName, value);
        expect(output).toHaveProperty("name", testItem.name);
        expect(output).toMatchObject({
          name: testItem.name
        });
        return value;
      }
    });
    expect(transformedObject).toMatchObject({
      name: testItem.name,
      age: testItem.age
    });
  });

  it("should not allow modifying the input object in format functions; throws error when in strict mode", () => {
    transform(testItem, {
      name(value: any, propName: string, input: POJO | any) {
        "use strict";
        expect(() => {
          // input object is frozen using Object.freeze() and
          // should throw errors if we try to assign new values
          (input as POJO)[propName] = "fail";
        }).toThrow();
      },
      age(value: any, propName: string, input: POJO | any) {
        "use strict";
        expect(() => {
          // input object is frozen using Object.freeze() and
          // should throw errors if we try to remove values
          delete (input as POJO)[propName];
        }).toThrow();
      }
    });
  });

  it.only("should ignore undefined props", () => {
    let transformedItem = transform(testItem, "notFoundOnInputObject", {
      notFoundOnInputObject: "testUndefined",
      dontReturnAnything: () => {}
    });
    expect(transformedItem).not.toHaveProperty("testUndefined", undefined);
    expect(transformedItem).not.toHaveProperty("dontReturnAnything", undefined);
  });

  it("should work since I've written this as an example in documentation", () => {
    const input = {
      test1: 1,
      testB: "2",
      testC: "03,04,05"
    };

    const outputMap = {
      // Takes `test1` from input and puts it on the output as `testA`
      test1: "testA",
      // Takes `testB` from input and formats its value on the output as `testB`
      testB: (value: any): number => parseInt(String(value), 10),
      // Takes `testC` from input and formats its value on the output as `testC`, `testD` and `testE`
      testC: (value: any): any => {
        let [testC, testD, testE] = value
          .split(",")
          .map((val: string) => parseInt(val, 10));
        return {
          testC,
          testD,
          testE
        };
      }
    };

    const output = transform(input, outputMap);
    expect(output).toMatchObject({
      testA: 1,
      testB: 2,
      testC: 3,
      testD: 4,
      testE: 5
    });
  });

  it("should sequentially transform object props #1", () => {
    const transformed: { propName: string; value: any }[] = [];
    const incrementTransformed = (value: any, propName: string) => {
      transformed.push({ propName, value });
    };

    transform(testItem, {
      name: incrementTransformed,
      age: incrementTransformed,
      dob: incrementTransformed,
      country: incrementTransformed
    });

    expect(transformed).toHaveLength(4);
    expect(transformed[0].propName).toBe("name");
    expect(transformed[1].propName).toBe("age");
    expect(transformed[2].propName).toBe("dob");
    expect(transformed[3].propName).toBe("country");
  });

  it("should sequentially transform object props #2", () => {
    const transformed: {
      propName: string | undefined;
      value: any;
      newPropName: string | undefined;
      output: any;
    }[] = [];
    const incrementTransformedFn = (newPropName: string): TransformFn => (
      value,
      propName,
      input,
      output
    ) => {
      transformed.push({
        propName,
        value,
        newPropName,
        output: { ...output }
      });

      return {
        [newPropName]: value
      };
    };

    const testOutput = transform(testItem, {
      name: incrementTransformedFn("newName"),
      age: incrementTransformedFn("newAge"),
      dob: incrementTransformedFn("newDob"),
      country: incrementTransformedFn("newCountry")
    });

    expect(Object.keys(testOutput)).toHaveLength(4);
    expect(testOutput).toMatchObject({
      newName: testItem.name,
      newAge: testItem.age,
      newDob: testItem.dob,
      newCountry: testItem.country
    });

    expect(transformed).toHaveLength(4);
    expect(transformed[0].propName).toBe("name");
    expect(transformed[0].newPropName).toBe("newName");
    expect(Object.keys(transformed[0].output)).toHaveLength(0);
    expect(transformed[1].propName).toBe("age");
    expect(transformed[1].newPropName).toBe("newAge");
    expect(Object.keys(transformed[1].output)).toHaveLength(1);
    expect(transformed[2].propName).toBe("dob");
    expect(transformed[2].newPropName).toBe("newDob");
    expect(Object.keys(transformed[2].output)).toHaveLength(2);
    expect(transformed[3].propName).toBe("country");
    expect(transformed[3].newPropName).toBe("newCountry");
    expect(Object.keys(transformed[3].output)).toHaveLength(3);
  });

  it("should sequentially transform object props #3", () => {
    const testOutput = transform(testItem, "name", {
      name: "newName",
      newName: "newName2",
      newName2: "newName3"
    });

    expect(testOutput).toMatchObject({
      name: testItem.name,
      newName: testItem.name,
      newName2: testItem.name,
      newName3: testItem.name
    });
  });

  it("should sequentially transform object props #4", () => {
    const testObject = {
      oldName: "oldName",
      changeName1: "changeName1",
      changeName2: "changeName2",
      changeName3: "changeName3"
    };

    const testOutput = transform(testObject, {
      oldName: "changedName1",
      changeName1: "changedName1",
      changeName2: "changedName2",
      changeName3: "changedName2"
    });

    expect(testOutput).toMatchObject({
      changedName1: "changeName1",
      changedName2: "changeName3"
    });
  });

  it("should ignore undefined values", () => {
    const testOutput = transform(testItem, {
      name: "name",
      undefinedProp: "nothing"
    });

    expect(testOutput).toHaveProperty("name", testItem.name);
    expect(testOutput).not.toHaveProperty("nothing");
  });
});
