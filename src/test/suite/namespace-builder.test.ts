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

	test('handles namespaces', () => {
    let source = [
      'module Mod::SubMod',
      '  class Klass'
    ].join('\n');
    namespaceEquals(source, 'Mod::SubMod::Klass');
  });

	test('handles instance methods', () => {
    let source = [
      'module Mod',
      '  class Klass',
      '    def instance_m'
    ].join('\n');
    namespaceEquals(source, 'Mod::Klass#instance_m');
  });

	test('handles class methods', () => {
    let source = [
      'module Mod',
      '  class Klass',
      '    def self.class_m'
    ].join('\n');
    namespaceEquals(source, 'Mod::Klass.class_m');
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

	test('ignores comments', () => {
    let source = [
      'module Mod',
      '  // class Comment',
      '  class Klass'
    ].join('\n');
    namespaceEquals(source, 'Mod::Klass');
  });
});
