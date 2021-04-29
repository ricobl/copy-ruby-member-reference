# Change Log

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Add support for method punctuation (e.g. `nil?`, `save!`, `name=`)

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
