'use strict';

const colors = {
  blue: 34,
  gray: 90,
  red: 31,
  yellow: 33
};

Object.keys(colors).forEach(color => {
  const code = colors[color];
  colors[color] = text => `\u001B[${code}m${text}\u001B[39m`;
});

function padNum(num, chars) {
  const numStr = Math.floor(num).toString();
  return numStr.padStart(chars, '0');
}

module.exports = { colors, padNum };
