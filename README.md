# Objectro

Transform and validate objects.

## Why?

* Destructure/restructure objects based on a map
* Format specific values (sanitise, normalise, etc.)
* Validate an object based on rules

## How?

```javascript
  objectro.transform(
    {
      example1: "This is a simple example",
      example2: "Another simple example",
      example3: "Another simple example to show arrays",
      emaxpel4: "Pluck properties from the object and rename them",
      example5: "DO SOME EXTRA FORMATTING AND RETURN AN OBJECT TO MERGE",
      example6: "Ignore this property"
    },
    // Pluck specific properties from an object to output
    "example1",
    ["example2", "example3"],
    // Give a map that transforms one property name to another.
    {
      emaxpel4: "example4",
      // You can also pass a format function to transform that value
      // further, such as sanitising, normalising or otherwise processing
      // the value
      example5: (value, propName) => ({
        [propName]: value.toLowerCase(),
        example6: "This is new!"
      })
    }
  )

  // Outputs:
  // {
  //   example1: "This is a simple example",
  //   example2: "Another simple example",
  //   example3: "Another simple example to show arrays",
  //   example4: "Pluck properties from the object and rename them",
  //   example5: "do some extra formatting and return an object to merge",
  //   example6: "This is new!"
  // }
```

```javascript
  objectro.validate(
    {
      name: "Objectro",
      version: "0.1.3",
      lastUpdated: "2018-11-14",
      keywords: ["transform", "validate", "object", "javascript"],
      randomNumber: 123,
      nestedObject: {
        example: true
      }
    },
    {
      // Will only return true if all nested rules match
      all: {
        // Will return true if at least one nested rule matches
        any: {
          // Will match positive if input object has either property
          has: ["name", "version", "nestedObject.example"]
        },
        // Check if property value has one or many possible values
        // Since this is within the `all` rule, all values must be
        // present within the property value.
        has: {
          keywords: ["transform", "validate", "javascript"]
        },
        // Allows you to use validation rules to validate individual
        // property values.
        // Since this is within the `all` rule, all values must be
        // present within the property value.
        match: {
          // Check if the property value type is a string
          version: {
            type: "string"
          },
          // Check if property value is greater than another value
          randomNumber: {
            gt: 100
          },
          // You can also use custom functions to validate properties
          lastUpdated: value => new Date(value).getFullYear() === 2018
        },
        // Negate the result of the following rules
        not: {
          has: {
            // You can also reference nested object properties
            "nestedObject.example": false
          }
        }
      }
    }
  )

  // Outputs:
  // true
```

Read more in the [docs](https://lvl99.github.io/objectro/).

## Installation

### Browser

```html
  <script src="//unpkg.com/objectro@0.1.0/dist/objectro.min.js"></script>
  <script>
    // window.objectro should then be available
    console.log(objectro)
  </script>
```

### ES Module

```bash
  npm i objectro
  yarn add objectro
```

Then in your source code:

```javascript
  // ES5
  const objectro = require("objectro").default

  // ES6
  import objectro from "objectro"
  import { transform, validate } from "objectro"
```

## Development

To download external dependencies:

```bash
  yarn
```

To run tests (using Jest):

```bash
  yarn test
```

## Contribute

Got cool ideas? Have questions or feedback? Found a bug? [Post an issue](https://github.com/lvl99/objectro/issues)

Added a feature? Fixed a bug? [Post a PR](https://github.com/lvl99/objectro/compare)

## License

[MIT](LICENSE.md)
