const Joi = require("joi");
const PropTypes = require("prop-types");
const validateEmail = require("email-validator");
const { validate } = require("../dist/objectro.cjs");

const testObject = {
  name: "Objectro",
  version: "0.1.0",
  dateCreated: "2018-11-01",
  keywords: ["transform", "validate", "javascript", "node", "browser"],
  author: {
    name: "Matt Scheurich",
    email: "matt@lvl99.com"
  },
  randomNumber: 123
};

const joiSchema = Joi.object().keys({
  name: Joi.string(),
  version: Joi.string().regex(/^\d+\.\d+\.\d+$/),
  dateCreated: Joi.date(),
  keywords: Joi.array(),
  author: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email()
  }),
  randomNumber: Joi.number()
});

const propTypesSchema = PropTypes.shape({
  name: PropTypes.string,
  version: PropTypes.string,
  dateCreated: PropTypes.string,
  keywords: PropTypes.array,
  author: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string
  }),
  randomNumber: PropTypes.number
});

const objectroSchema = {
  all: {
    match: {
      name: {
        type: "string"
      },
      version: {
        type: "string",
        re: /^\d+\.\d+\.\d+$/
      },
      dateCreated: value => {
        try {
          new Date(value);
          return true;
        } catch (error) {
          return false;
        }
      },
      keywords: {
        type: "array"
      },
      author: {
        match: {
          name: {
            type: "string"
          },
          email: value => validateEmail(value)
        }
      },
      randomNumber: {
        type: "number"
      }
    }
  }
};

suite("validate object schema", () => {
  test("joi", () => {
    joiSchema.validate(testObject);
  });

  test("propTypes", () => {
    PropTypes.checkPropTypes(propTypesSchema, testObject, "prop", "testItem");
  });

  test(
    "objectro.validate",
    () => {
      validate(testObject, objectroSchema);
    },
    {
      expectedRanking: "top 5%"
    }
  );
});
