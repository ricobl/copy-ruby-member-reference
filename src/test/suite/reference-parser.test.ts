import * as assert from 'assert';
import { ReferenceParser } from '../../reference-parser';

suite.only('ReferenceParser', () => {
  function parseEquals(source: string, expected: Array<string>) {
    let parser = new ReferenceParser(source);
    let result = parser.parse();
    assert.deepEqual(result, expected);
  }

	test('parses simple module', () => {
    parseEquals('module Mod', ['Mod']);
  });

	test('parses simple class', () => {
    parseEquals('class Klass', ['Klass']);
  });

	test('parses nested members', () => {
    let source = [
      'module Mod',
      '  class Klass'
    ].join('\n');
    parseEquals(source, ['Mod', 'Klass']);
  });
});
