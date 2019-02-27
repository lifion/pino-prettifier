# pino-prettifier

[![npm version](https://badge.fury.io/js/pino-prettifier.svg)](http://badge.fury.io/js/pino-prettifier)

This package provides a log prettifier for the [Pino](https://getpino.io/) logging library.

## Usage

Install the library as usual:

```sh
npm install pino-prettifier
```

Then use the proper `pino` options:

```JS
const pino = require('pino');
const prettifier = require('pino-prettifier');
const logger = pino({
  prettyPrint: true,
  prettifier
});
```

## License

[MIT](LICENSE)
