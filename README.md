# Objectro

Transform and validate objects.

## Why?

* Destructure/restructure objects based on a map
* Format specific values
* Validate an object based on specific properties

### Transform

There are a couple ways to change the structure and content of the object: [destructure/restructure](#destructure-restructure) and [format](#format).

By design a source object given to the `objectro.transform()` method won't be changed, but a new object will be created referencing their content.

#### Destructure/Restructure

ES6 already allows us to do object destructuring, but sometimes we need something more programmatic.

Objectro allows you to transform objects similar to GraphQL, taking only the properties that you specify, additionally changing the property names on the outputted object:

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
  const transformedObject = jsoq.transform(sourceObject, "nationality", "location", {
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

Alongside destructuring, you can also format values:

```javascript
  const transformedObject = jsoq.transform(sourceObject, {
    // Format the source property's value from a string to a Date
    dateOfBirth: value => new Date(value),
    // Transform the source object's property into a different format
    name: (value, srcObj, destObj) => {
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
    canSpeakEnglish: (value, srcObj) => ({
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

`jsoq.validate()` allows you to check if an object matches a set of conditions:

```javascript
  const jsoq = require("jsoq")

  const sourceObject = {
    name: "Matt Scheurich",
    dateOfBirth: "1983-04-17",
    nationality: "nz",
    location: "fr",
    languages: ["en", "fr"]
  }

  jsoq.validate(sourceObject, {
    languages: "en",
    nationality: "nz"
  }) // returns true because sourceObject.nationality is "nz"
     // and languages has a value of "en"
```

You can also feed it an array of accepted values:

```javascript
  jsoq.validate(sourceObject, {
    languages: ["fr", "de", "it"],
    location: ["fr", "de", "it"]
  }) // returns true because sourceObject.languages has a value of "fr"
     // and sourceObject.location is "fr"
```

## Installation

### Browser

```html
  <script src="//unpkg.com/jsoq@0.1.0/dist/jsoq.min.js"></script>
  <script>
    // window.oql should then be available
    console.log(jsoq)
  </script>
```

### ES Module

```bash
  npm i jsoq
  yarn add jsoq
```

Then in your source code:

```javascript
  // ES5
  const jsoq = require("jsoq")

  // ES6
  import jsoq from "jsoq"
  import { transform, validate } from "jsoq"
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

Got cool ideas? Have questions? Found a bug? [Post an issue](https://github.com/lvl99/jsoq/issues)

Added a feature? Fixed a bug? [Post a PR](https://github.com/lvl99/jsoq/compare)

## License

Copyright 2018 Matt Scheurich.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
