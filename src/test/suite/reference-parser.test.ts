import * as assert from 'assert';
import { ReferenceParser, Member } from '../../reference-parser';

suite.only('ReferenceParser', () => {
  function parseEquals(source: string, expected: Array<Member>) {
    let parser = new ReferenceParser(source);
    let result = parser.parse();
    assert.deepEqual(result, expected);
  }

	test('parses simple module', () => {
    parseEquals('module Mod', [new Member('module', 'Mod')]);
  });

	test('parses simple class', () => {
    parseEquals('class Klass', [new Member('class', 'Klass')]);
  });

	test('parses inherited class', () => {
    parseEquals('class Klass < Base', [new Member('class', 'Klass')]);
  });

	test('parses nested members', () => {
    let source = [
      'module Mod',
      '  class Klass'
    ].join('\n');
    parseEquals(source, [new Member('module', 'Mod'), new Member('class', 'Klass')]);
  });

	test('only considers the last member on a level', () => {
    let source = [
      'module Mod',
      '  class FirstKlass',
      '  end',
      '  class LastKlass'
    ].join('\n');
    parseEquals(source, [new Member('module', 'Mod'), new Member('class', 'LastKlass')]);
  });
});
