/* eslint-disable no-control-regex */

'use strict';

const index = require('.');

describe('lib/index', () => {
  const logger = index();

  test('the module exports the expected', () => {
    expect(index).toEqual(expect.any(Function));
  });

  test('the module exports a function factory', () => {
    expect(index({})).toEqual(expect.any(Function));
  });

  test('the prettifier works with no configuration nor arguments', () => {
    expect(logger()).toMatch(/^\u001B\[90m\u001B\[39m USERLVL <.+> \[.+:\d+]\n\s{14}$/);
  });

  test('time in numerical form is properly formatted', () => {
    const output = logger({ time: new Date().getTime() });
    expect(output).toMatch(/^\u001B\[90m\d{2}:\d{2}:\d{2}\.\d{3}\u001B\[39m/);
  });

  test('time in a quoted form is properly formatted', () => {
    const output = logger({ time: JSON.stringify(new Date()) });
    expect(output).toMatch(/^\u001B\[90m\d{2}:\d{2}:\d{2}\.\d{3}\u001B\[39m/);
  });

  test('debug messages are properly formatted', () => {
    const output = logger({ level: 20 });
    expect(output).toMatch(/\u001B\[34mDEBUG <.+> \[.+:\d+]\u001B\[39m\n/);
  });

  test('error messages are properly formatted', () => {
    const output = logger({ level: 50 });
    expect(output).toMatch(/\u001B\[31mERROR <.+> \[.+:\d+]\u001B\[39m\n/);
  });

  test('warning messages are properly formatted', () => {
    const output = logger({ level: 40 });
    expect(output).toMatch(/\u001B\[33mWARN <.+> \[.+:\d+]\u001B\[39m\n/);
  });

  test('JSON fragments are properly formatted', () => {
    const output = logger({ msg: `${JSON.stringify({ foo: 'bar' })} baz` });
    expect(output).toMatch("{ foo: \u001B[32m'bar'\u001B[39m } baz\n");
  });

  test('pino stack lines are ignored', () => {
    const orgCaptureStack = Error.captureStackTrace;
    Error.captureStackTrace = obj => {
      Object.assign(obj, {
        stack: [
          ' at Object.write (/home/foo/node_modules/pino/lib/tools.js:1:2)',
          ' at Pino.write (/home/foo/node_modules/pino/lib/proto.js:3:4)',
          ' at bar (baz:5:6)',
          ' at qux (quux:7:8)'
        ].join('\n')
      });
    };
    expect(logger()).toMatch('<qux> [quux:7]');
    Error.captureStackTrace = orgCaptureStack;
  });

  test('incomplete stack lines are ignored', () => {
    const orgCaptureStack = Error.captureStackTrace;
    Error.captureStackTrace = obj => {
      Object.assign(obj, {
        stack: [
          ' at Object.write (/home/foo/node_modules/pino/lib/tools.js:1:2)',
          ' at Pino.write (/home/foo/node_modules/pino/lib/proto.js:3:4)',
          ' at bar (baz:5:6)'
        ].join('\n')
      });
    };
    expect(logger()).toMatch('USERLVL \n');
    Error.captureStackTrace = orgCaptureStack;
  });

  test('array messages are properly formatted', () => {
    const output = logger({ msg: [{ foo: 'bar' }] });
    expect(output).toMatch("[ { foo: \u001B[32m'bar'\u001B[39m } ]\n");
  });

  test('array fragments are properly formatted', () => {
    const output = logger({ msg: `${JSON.stringify([{ foo: 'bar' }])} baz` });
    expect(output).toMatch("[ { foo: \u001B[32m'bar'\u001B[39m } ] baz\n");
  });
});
