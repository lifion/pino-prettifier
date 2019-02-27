/* eslint-disable no-control-regex */

'use strict';

const utils = require('./utils');

describe('lib/utils', () => {
  test('the module exports the expected', () => {
    expect(utils).toEqual({
      colors: expect.any(Object),
      padNum: expect.any(Function)
    });
  });

  test('the colors export are all functions that return colored-strings', () => {
    const { colors } = utils;
    Object.keys(colors).forEach(key => {
      const color = colors[key];
      expect(color).toEqual(expect.any(Function));
      expect(color('foo')).toMatch(/^\u001B\[\d+mfoo\u001B\[39m$/);
    });
  });

  test('the padNum export returns the expected formatted decimal number', () => {
    const { padNum } = utils;
    expect(padNum(12.345, 5)).toBe('00012');
  });
});
