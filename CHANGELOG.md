# Change Log

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## Unreleased

## 1.3.4

- Update dependencies to address vulnerabilities
- Reset project structure using the latest VSCode extension generator
  - includes migrating to esbuild

## 1.3.3

- Update a bunch of dependencies to address vulnerabilities

## 1.3.2

- Update extension development config based on latest Yeoman generator (again)
  - this time moving away from webpack to keep things simpler

## 1.3.1

- Update dependencies to resolve [CVE-2021-3807](https://github.com/advisories/GHSA-93q8-gq69-wqmw)
- Update extension development config based on latest Yeoman generator

## 1.3.0

- [Fix security vulnerability with lodash](https://github.com/ricobl/copy-ruby-member-reference/pull/4)

## 1.2.0

- Add support for method punctuation (e.g. `nil?`, `save!`, `name=`)
- Add support for rake tasks and namespaces

## 1.1.0

- Support inline `private_class_method`
- Use modal info messages as it makes it easier for dismissing using the keyboard

## 1.0.5

- Include extension icon

## 1.0.4

- Handle class methods under `class << self`
- Resolve [CVE-2020-8203](https://github.com/advisories/GHSA-p6mc-m468-83gw)

## 1.0.3

- Handle dedents properly
- Handle class assignments

## 1.0.2

- Provide the whole current line to builder/parser

## 1.0.1

- Fix parser not picking up constants with underscores

## 1.0.0

- Initial release providing a command to copy Ruby member references to the clipboard.
