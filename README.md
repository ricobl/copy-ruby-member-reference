# Copy Ruby Member Reference

Allows copying the Ruby member reference under the cursor to the clipboard.

It has a simple built-in regex-based parser that supports most common scenarios: modules, classes, instance methods, class methods and constants.

## Features

* **Copy Ruby Member Reference** command: will copy the current reference to the clipboard.

## Keyboard shortcut

No keyboard shortcut is provided at the moment to prevent conflicts with other extensions. Suggested usage is via the command palette, typically pressing Cmd+Shift+P / Ctrl+Shift+P and typing the command name.

Follow the [keybindings documentation](https://code.visualstudio.com/docs/getstarted/keybindings) to map the `copy-ruby-member-reference.copyReference` command to your own keybinding.

## Known Issues

Some class methods definitions are not understood by the extension and might be copied as instance methods, these patterns include:

* `class << self`
* `extend self`
* `module_function`

Parsing currently relies on proper indentation levels.

## Release Notes

Please see the [changelog](CHANGELOG.md).

## Why another extension?

Other existing extensions wouldn't cover scenarios that I needed and I wanted to some fun writing my own extension and use the opportunity learn Typescript.

## Development

### Running tests

* Open the debug viewlet (`Ctrl+Shift+D` or `Cmd+Shift+D` on Mac) and from the launch configuration dropdown pick `Extension Tests`.
* Press `F5` to run the tests in a new window with your extension loaded.
* See the output of the test result in the debug console.