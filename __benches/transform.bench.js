const objectMapper = require("object-mapper");
const { transform } = require("../lib/transform");

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

const objectMapperMap = {
  name: "fullName",
  age: "ageInYears",
  dob: {
    key: "dob",
    transform: value => new Date(value)
  },
  notFoundOnInputObject: {
    key: "notFoundOnInputObject?",
    transform: value => false
  },
  country: "country",
  languages: "languages"
};

const objectroTransformMap = [
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
];

suite("transform object", () => {
  test("object-mapper", () => {
    objectMapper(testItem, objectMapperMap);
  });

  test("objectro.transform", () => {
    transform(testItem, objectroTransformMap);
  });
});
