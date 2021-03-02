'use strict';

const colorize = (code) => (text) => `\u001B[${code}m${text}\u001B[39m`;

const colors = {
  blue: colorize(34),
  gray: colorize(90),
  red: colorize(31),
  yellow: colorize(33)
};

function padNum(num, chars) {
  const numStr = Math.floor(num).toString();
  return numStr.padStart(chars, '0');
}

module.exports = { colors, padNum };
