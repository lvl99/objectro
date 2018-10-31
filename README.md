# Objectro

Transform and validate objects.

## Why?

* Destructure/restructure objects based on a map
* Format specific values (sanitise, normalise, etc.)
* Validate an object based on rules

### Transform

There are a couple ways to change the structure and content of the object: [destructure/restructure](#destructure-restructure) and [format](#format).

By design a source object given to the `objectro.transform()` method won't be changed, but a new object will be created referencing their content.

#### Destructure/Restructure

ES6 already allows us to do object destructuring, but sometimes we need something more programmatic.

Objectro allows you to transform objects similar to GraphQL, taking only the properties that you specify, additionally changing the property names on the outputted object:

```
  {
    fromPropertyName: "toPropertyName"
  }
```

```javascript
  const objectro = require("objectro")

  const sourceObject = {
    name: "Matt Scheurich",
    dateOfBirth: "1983-04-17",
    nationality: "nz",
    location: "fr",
    languages: ["en", "fr"]
  }

  // The simplest transform takes the source object's property name and
  // maps it to a new one
  const transformedObject = objectro.transform(sourceObject, {
    name: "fullName",
    nationality: "placeOfBirth",
    location: "countryOfResidence"
  })

  console.log(transformedObject)

  /*
  {
    fullName: "Matt Scheurich",
    placeOfBirth: "nz",
    countryOfResidence: "fr"
  }
  */
```

You could also just feed it a number of property names as well as transform maps:

```javascript
  const transformedObject = objectro.transform(sourceObject, "nationality", "location", {
    name: "fullName",
    nationality: "placeOfBirth",
    location: "countryOfResidence"
  })

  console.log(transformedObject)

  /*
  {
    nationality: "nz",
    location: "fr",
    fullName: "Matt Scheurich",
    placeOfBirth: "nz",
    countryOfResidence: "fr"
  }
  */
```

#### Format

Alongside destructuring, you can also format values with a function. The function can either return the formatted value or return an object that will be merged into the destination object:

```
  {
    fromPropertyName: formatValue(
      fromPropertyValue: any,
      fromPropertyName: string,
      source: object,
      destination: object
    ) -> mergeIntoDestinationObject: object
  }
```

```javascript
  const transformedObject = objectro.transform(sourceObject, {
    // Format the source property's value from a string to a Date
    dateOfBirth: value => new Date(value),
    // Transform the source object's property into a different format
    name: (value, propName, srcObj) => {
      // Format the value however you want...
      let [firstName, ...lastNames] = value.split(" ")
      // ... then return an object which will be merged with the
      // destination object
      return {
        firstName,
        lastName: lastNames.join(" ")
      }
    },
    // Parameter `value` will be undefined since `canSpeakEnglish` is
    // not on the source object
    canSpeakEnglish: (value, propName, srcObj) => ({
      canSpeakEnglish: srcObj.languages.includes("en")
    })
  })

  console.log(transformedObject)

  /*
  {
    dateOfBirth: Sun Apr 17 1983 00:00:00 GMT+0000,
    firstName: "Matt",
    lastName: "Scheurich",
    canSpeakEnglish: true
  }
  */
```

### Validate

`objectro.validate()` allows you to check if an object matches a set of conditions:

```javascript
  const objectro = require("objectro")

  const sourceObject = {
    name: "Matt Scheurich",
    dateOfBirth: "1983-04-17",
    nationality: "nz",
    location: "fr",
    languages: ["en", "fr"]
  }

  objectro.validate(sourceObject, {
    languages: "en",
    nationality: "nz"
  }) // returns true because sourceObject.nationality is "nz"
     // and languages has a value of "en"
```

You can also feed it an array of accepted values:

```javascript
  objectro.validate(sourceObject, {
    languages: ["fr", "de", "it"],
    location: ["fr", "de", "it"]
  }) // returns true because sourceObject.languages has a value of "fr"
     // and sourceObject.location is "fr"
```

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
  const objectro = require("objectro")

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