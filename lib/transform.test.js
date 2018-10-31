import transform from "./transform";

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
    let addIfTrue = (value, propName) =>
      value ? { [propName]: value } : undefined;
    let transformedItemA = transform(testItem, {
      petPreferences: {
        cat: "cats",
        dog: addIfTrue,
        rat: addIfTrue
      }
    });
    expect(transformedItemA).toHaveProperty("petPreferences");
    expect(transformedItemA.petPreferences).toMatchObject({
      cats: testItem.petPreferences.cat,
      dog: testItem.petPreferences.dog
    });

    // Use an array to pass in string prop names
    let transformedItemB = transform(testItem, {
      petPreferences: [
        "cat",
        {
          rat: value => ({ rats: value })
        }
      ]
    });
    expect(transformedItemB).toHaveProperty("petPreferences");
    expect(transformedItemB.petPreferences).toMatchObject({
      cat: testItem.petPreferences.cat,
      rats: testItem.petPreferences.rat
    });
  });

  it("should map input property name using returned value of formatted function", () => {
    let transformedItem = transform(testItem, {
      name: value => value.split(" "),
      age: value => `${value}`,
      dob: value => {
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
        dob: value => ({
          dateOfBirth: new Date(value)
        }),
        notFoundOnInputObject: (value, propName, input, output) => {
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
      name(value, propName, input, output) {
        expect(this).toHaveProperty(propName, value);
        expect(value).toBe(testItem.name);
        expect(propName).toBe("name");
        expect(output).toMatchObject({});
        return value;
      },
      age(value, propName, input, output) {
        expect(this).toHaveProperty(propName, value);
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

  it("should not allow modifying the input object in format functions", () => {
    transform(testItem, {
      name() {
        expect(() => {
          // `this` will represent the input object, however it has been frozen
          // using Object.freeze() and should throw errors if we try to assign
          // new values
          this.name = "fail";
        }).toThrow();
      },
      age() {
        expect(() => {
          // `this` will represent the input object, however it has been frozen
          // using Object.freeze() and should throw errors if we try to assign
          // new values
          delete this.name;
        }).toThrow();
      }
    });
  });

  it("should still handle undefined props", () => {
    let transformedItem = transform(testItem, "notFoundOnInputObject", {
      notFoundOnInputObject: "testUndefined",
      dontReturnAnything: () => {}
    });
    expect(transformedItem).toHaveProperty("notFoundOnInputObject", undefined);
    expect(transformedItem).toHaveProperty("testUndefined", undefined);
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
      testB: value => parseInt(value, 10),
      // Takes `testC` from input and formats its value on the output as `testC`, `testD` and `testE`
      testC: value => {
        let [testC, testD, testE] = value
          .split(",")
          .map(val => parseInt(val, 10));
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
});
