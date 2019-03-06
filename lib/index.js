'use strict';

const { inspect } = require('util');
const { relative } = require('path');
const { colors, padNum } = require('./utils');

const levels = {
  10: 'TRACE',
  20: 'DEBUG',
  30: 'INFO',
  40: 'WARN',
  50: 'ERROR',
  60: 'FATAL'
};

const exportsRegex = /^(Object\.)?module\.exports\./;
const sourceRegex = /^\s+at (.+) \((.+):(\d+):\d+/;

const INDENT = ' '.repeat(13);
const CWD = process.cwd();

function formatTime(time) {
  if (!time) return time;
  const epoch = !Number.isInteger(time) ? Date.parse(JSON.parse(time)) : time;
  const epochS = epoch / 1000;
  const epochM = epochS / 60;
  const ms = padNum(epoch % 1000, 3);
  const s = padNum(epochS % 60, 2);
  const m = padNum(epochM % 60, 2);
  const h = padNum((epochM / 60) % 24, 2);
  return [h, ':', m, ':', s, '.', ms].join('');
}

function getLevelColor(level) {
  switch (level) {
    case 20:
      return colors.blue;
    case 50:
      return colors.red;
    case 40:
      return colors.yellow;
    default:
      return str => str;
  }
}

function formatMsg(msg = '') {
  return msg
    .split(' ')
    .map(chunk => {
      if (!chunk.startsWith('{') || !chunk.endsWith('}')) return chunk;
      return inspect(JSON.parse(chunk), { colors: true });
    })
    .join(' ')
    .split('\n')
    .map(i => [INDENT, i].join(''))
    .join('\n');
}

function getSource(stack) {
  let stackLines = stack.split('\n').slice(1);
  const skipIndex = stackLines.findIndex(i => i.includes(' [as '));
  if (skipIndex > -1) stackLines = stackLines.slice(skipIndex + 1);
  const [stackFrame] = stackLines;
  const stackData = stackFrame.match(sourceRegex);
  if (stackData === null) return '';
  const [, at, filename, lineNumber] = stackData;
  const functionName = at.replace(exportsRegex, '');
  const relativePath = relative(CWD, filename);
  return ['<', functionName, '> [', relativePath, ':', lineNumber, ']'].join('');
}

module.exports = ({ messageKey = 'msg' } = {}) => {
  function prettifier(data = {}) {
    const captureObj = {};
    Error.captureStackTrace(captureObj, prettifier);
    const source = getSource(captureObj.stack);
    const msg = data[messageKey];
    const { level, time } = data;
    const prefix = colors.gray([formatTime(time)].join(''));
    const color = getLevelColor(level);
    const text = color([levels[level] || 'USERLVL', ' ', source].join(''));
    return [prefix, ' ', text, '\n', formatMsg(msg), '\n'].join('');
  }
  return prettifier;
};
