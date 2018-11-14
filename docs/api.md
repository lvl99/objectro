# API

## Transform

```
  objectro.transform(
    input: object,
    propertyName: string
      | Array<string>
      | TransformMap
    ): object
```

Transforming allows you to take an input object and describe how you want its property names and values to be reformatted.

Transforming will allow you to:

- Pluck selected properties from an object
- Destructure from one model to another
- Format values (sanitise, normalise, etc.)

```javascript
  const objectro = require("objectro").default

  let input = {
    test1: 1,
    testB: "2",
    testC: "03,04,05"
  }

  // This transform map specifies how we want to reformat the input object
  let outputMap = {
    // Takes `test1` from input and puts it on the output as `testA`
    test1: "testA",
    // Takes `testB` from input and formats its value on the
    // output as `testB`
    testB: value => parseInt(value, 10),
    // Takes `testC` from input and formats its value on the
    // output as `testC`, `testD` and `testE`
    testC: value => {
      let [ testC, testD, testE ] = value
        .split(",")
        .map(val => parseInt(val, 10));
      return {
        testC,
        testD,
        testE
      }
    }
  }

  objectro.transform(input, outputMap)

  // Outputs:
  // {
  //   testA: 1,
  //   testB: 2,
  //   testC: 3,
  //   testD: 4,
  //   testE: 5
  // }
```

It's worth noting that you don't need to use a transform map if you only want to pluck certain values from an object. Instead of transform maps, you can use string values (or arrays of strings) to mark the properties you do want to keep:

```javascript
  const objectro = require("objectro").default

  let input = {
    testA: "Hello",
    testB: "This is a simple test",
    testC: "Don't need this property",
    testD: "Rename this property to testC"
  }

  objectro.transform(input, "testA", "testB")

  // Outputs:
  // {
  //   testA: "Hello",
  //   testB: "This is a simple test"
  // }
```

You can combine all accepted argument types and `objectro.transform` will apply them in sequence:

```javascript
  objectro.transform(input, "testA", ["testB"], { testD: "testC" })

  // Outputs:
  // {
  //   testA: "Hello",
  //   testB: "This is a simple test",
  //   testC: "Rename this property to testC"
  // }
```

### Transform Map

```
  {
    fromPropertyName: string
      | map: TransformMap
      | formatFn: Function(
        value: any,
        propName: string,
        input: object,
        output: object
      )
  }
```

A transform map is an object which maps an input object's structure from one model to another.

The transform map will generally mimic the input object's structure, however the values of each property can vary:

```javascript
  {
    fromPropertyName: "toPropertyName"
  }
```

The above transforms from one property name on the input object to a different property name on the output object.

```javascript
  {
    fromPropertyName: {
      nestedObjectFromPropertyName: "toPropertyName"
    }
  }
```

If `fromPropertyName` is a nested object, you can nest transform maps that will be applied to that nested object. Note that the nested objects will be placed under the `fromPropertyName` -- if you need to change the parent property name, you can use a `formatFn`.

Using the `formatFn` method also allows more control over formatting the value and where that value will be placed in the output object.

```javascript
  {
    fromPropertyName:
      (fromPropertyValue, propName, inputObject, outputObject) => {
        // Return either a new non-object value to be the new property
        // value, or return an object to merge into the output object.
        // This method is good for when you need to split one value into
        // multiple values or multiple properties on the output object.
        return {
          toPropertyName: fromPropertyValue
        }
      }
    }
  }
```

## Validate

```
  objectro.validate(
    input: any,
    rules: ValidationRules,
    options: ValidationOptions
  ): boolean
```

You can verify an object's structure and its contents using `objectro.validate`. You can also combine multiple rules and use rule modifiers to change behaviours of those rules.

Validation allows you to:

- Verify an object's structure
- Verify individual properties using a variety of expressions

The simplest rules to use are:

- [`has`](#validation-rules): Check object has a property or if a property has a value.
- [`match`](#validation-rules): Apply rules to an object's properties

The following rule modifiers change the behaviour of any nested rules:

- [`any`](#validation-rules): match any rule given (this is the default behaviour)
- [`all`](#validation-rules): match all rules given
- [`not`](#validation-rules): negate the returned value

```js
  const objectro = require("objectro").default;

  function isDefined(input) {
    return input !== null && input !== undefined;
  }

  function validateExample(input) {
    return objectro.validate(input, {
      // All nested rules must positively match to be valid
      all: {
        // Check that the input type is an object
        type: "object",
        // Check if the input object has a "name" property
        // (we don't care if it's not defined)
        has: "name",
        // Run specific rules against multiple properties
        match: {
          // We can specify multiple rules for each named property
          age: {
            // These rules check if the "age" property is a string
            // and greater than or equal to 18
            type: "string",
            gte: 18
          },
          // Here we can enforce that we want the name to be defined
          // by using a custom function to validate the value
          name: isDefined
        }
      }
    });
  }

  validateExample({}) // false
  validateExample({ "example": true }) // false
  validateExample("{}") // false
  validateExample({ name: "Example" }) // false
  validateExample({ age: "55" }) // false
  validateExample({ name: "Example", age: 16 }) // false
  validateExample({ name: null, age: 35 }) // false
  validateExample({ name: "Example", age: 35 }) // true
```

Using the `ValidationOptions.data` option, we can supply meta-data that can be validated if the original input object does not contain the referenced property:

```javascript
  const objectro = require("objectro").default

  const input = {
    name: "Matt Scheurich",
    nationality: "nz",
    location: "fr",
    languages: ["en", "fr"]
  };

  const canUnderstandEachOther = (lang) => {
    objectro.validate(input, {
      all: {
        has: {
          // Check if the languages field has the locale value assigned
          languages: lang,
          // This property is not on the original input object
          // however we do feed it via the `ValidationOptions.data` value
          systemLanguages: lang
        }
      }
    }, {
      data: {
        systemLanguages: ["en", "de"]
      }
    })
  }

  canUnderstandEachOther("fr")
  // false: input.languages has "fr", but data.systemLanguages doesn't

  canUnderstandEachOther("de")
  // false: data.systemLanguages has "de", but input.languages doesn't

  canUnderstandEachOther("en") // true
```

### Validation Rules

There are three types of rules:

- *Modifier*: modifies the behaviour of the nested rules.
- *Expression*: takes an input value and compares it with another value/condition.
- *Map*: takes an object that maps the input object's properties to rules to run against those properties.

| Rule | Type | Description |
|:-|:-:|--|--|
| `any` | Modifier | Return true if any nested rules match |
| `all` | Modifier | Return true only if all nested rules match |
| `not` | Modifier | Negate the return value: `true` ⇒ `false`, `false` ⇒ `true` |
| `has` | Expression, Map | Check for existence of properties (using a `string` or `Array<String>`), or for possible values (using an `object`) |
| `match` | Map | Validate properties using nested `ValidationRules` objects for each property name |
| `type` | Expression | Check if input matches a specific type: `string`, `number`, `integer`, `float`, `boolean`, `array`, `arrayLike`, `set`, `map`, `object`, `objectLike`, `plainObject`, `function` ([more](https://github.com/lvl99/objectro/blob/8a63bbf24d235936d70d9a292a7d231c3995f880/lib/validate.js#L72-L96)) |
| `eq` | Expression | Equality (`==`) |
| `eqs` | Expression | Strict equality (`===`) |
| `gt` | Expression | Greater than |
| `gte` | Expression | Greather than or equals |
| `lt` | Expression | Less than |
| `lte` | Expression | Less than or equals |
| `re` | Expression | RegExp test |
| `startsWith` | Expression | Check if input starts with a value |
| `endsWith` | Expression | Check if input ends with a value |
| `contains` | Expression | Check if input (string or array) contains value |

There are more [specialised rules](https://github.com/lvl99/objectro/blob/8a63bbf24d235936d70d9a292a7d231c3995f880/lib/validate.js#L101) available.

### Validation Options

| Option | Type | Description |
|:-|:-:|--|
| `matchAll` | boolean | Return true only if all rules within the [ValidationRules](#validation-rules) object match |
| `negateMatch` | boolean | Return the opposite of the match's result |
| `skipMissingProps` | boolean | Pass any properties on the input object if they don't exist or are undefined |
| `data` | object | Supply extra data to validate against. If the input object does not contain the property within the rules, `objectro.validate` will then check this object. |
