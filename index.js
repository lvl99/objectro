const { transform } = require("./lib/transform");
const { validate } = require("./lib/validate");

const objectro = {
  transform,
  validate
};

module.exports = {
  default: objectro,
  transform,
  validate
};
