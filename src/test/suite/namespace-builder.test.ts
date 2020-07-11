import * as assert from 'assert';
import { NamespaceBuilder } from '../../namespace-builder';

suite.only('NamespaceBuilder', () => {
  function namespaceEquals(source: string, expected: string) {
    let builder = new NamespaceBuilder(source);
    let result = builder.build();
    assert.deepEqual(result, expected);
  }

	test('handles simple module', () => {
    namespaceEquals('module Mod', 'Mod');
  });

	test('handles simple class', () => {
    namespaceEquals('class Klass', 'Klass');
  });

	test('handles inherited class', () => {
    namespaceEquals('class Klass < Base', 'Klass');
  });

	test('handles nested members', () => {
    let source = [
      'module Mod',
      '  class Klass'
    ].join('\n');
    namespaceEquals(source, 'Mod::Klass');
  });

	test('only considers the last member on a level', () => {
    let source = [
      'module Mod',
      '  class FirstKlass',
      '  end',
      '  class LastKlass'
    ].join('\n');
    namespaceEquals(source, 'Mod::LastKlass');
  });
});
