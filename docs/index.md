# Objectro

Transform and validate objects.

## Why?

* [Destructure/restructure](#destructure-restructure) objects based on a map
* [Format](#format) specific values (sanitise, normalise, etc.)
* [Validate](#validate) an object's structure or values based on rules

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
  const transformedObject = objectro.transform(sourceObject,
    "nationality",
    "location",
    {
      name: "fullName",
      nationality: "placeOfBirth",
      location: "countryOfResidence"
    }
  )

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

`objectro.validate()` allows you to check if an object matches a set of conditions.

You can check if the object has the existence of certain properties (note
that this does not check the value, only if the property exists):

```javascript
  const objectro = require("objectro").default

  const sourceObject = {
    name: "Matt Scheurich",
    dateOfBirth: "1983-04-17",
    age: 35,
    nationality: "nz",
    location: "fr",
    languages: ["en", "fr"],
    website: "https://www.lvl99.com",
    skills: {
      programming: ["html", "css", "javascript", "node", "frontend", "backend", "threejs"],
      design: ["graphic", "publication", "typography", "illustration"],
      music: ["drums", "guitar", "production", "ableton"]
    },
    traits: ["positive", "helpful", "happy", "encouraging", "team member"]
  }

  objectro.validate(sourceObject, {
    has: ["name", "dateOfBirth", "skills.programming"]
  }) // returns true because sourceObject has all three
     // specified properties
```

There are also three rule modifiers you can use to nest more rules within:

* `any`: Returns true on the first positive rule match
* `all`: Returns true only if all following rules match
* `not`: Negates the returned result, e.g. `true` ⇒ `false`

```javascript
    objectro.validate(sourceObject, {
        // Returns true only if all nested rules match
        all: {
          // Since `all` is defined above, it will apply to all the
          // options in `has` here.
          // This means that all the rules within the `has` rule
          // need to match in order to achieve a positive result.
          has: {
            languages: "en",
            "skills.programming": [
              "html",
              "css",
              "javascript",
              "frontend"
            ]
          },
          // Returns true on the first positive match
          any: {
            has: ["name", "age", "location"]
          },
          // Returns the inverse of the result, e.g. true = false
          not: {
            has: {
              traits: ["negative", "downer"]
            }
          }
        }
      }
    }) // returns true
```

You can easily check an object's property values for one or many possible
values:

```javascript
  objectro.validate(sourceObject, {
    has: {
      languages: "en",
      nationality: "nz",
      "skills.music": ["production", "ableton"]
    }
  }) // returns true because sourceObject.nationality is "nz"
     // and languages has a value of "en"
```

You can also feed it an array of accepted values:

```javascript
  objectro.validate(sourceObject, {
    has: {
      languages: ["fr", "de", "it"],
      location: ["fr", "de", "it"]
    }
  }) // returns true because sourceObject.languages has a value of "fr"
     // and sourceObject.location is "fr"
```

You can also validate individual properties with nested rule objects using the
`match` rule:

```javascript
  objectro.validate(sourceObject, {
    match: {
      // We can match multiple rules on a single property
      name: {
        all: {
          type: "string",
          startsWith: "Matt"
        }
      },
      // Alternatively we can use a function to validate the property
      languages: value => typeof value === "array" && !value.length > 1,
      dateOfBirth: value =>
        new Date(value).getFullYear() >= (new Date().getFullYear() - 18)
    }
  })
```

There are lots of rules you can use to validate objects or their properties.

For more information, view the [API](api.md#validation-rules).
