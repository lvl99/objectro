# Objectro

Transform and validate objects.

## Why?

* Destructure/restructure objects based on a map
* Format specific values (sanitise, normalise, etc.)
* Validate an object based on rules

## How?

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
