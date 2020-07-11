// import * as vscode from 'vscode';

export class ReferenceParser {
  source: string;

  constructor(source: string) {
    this.source = source;
  }

  parse() : Array<string> {
    return this.members();
  }

  members() : Array<string> {
    const membersRegex = /^(?:\n*)(\s*)(class|module)(?:\s+)(\w+)/gm;
    const matches = this.source.matchAll(membersRegex);

    const items : Array<string> = [];
    let lastIndentLength = 0;
    let indentLevel = 0;

    for (let [_match, indent, _type, name] of matches) {
      // Remove any previous items on the same level
      if (lastIndentLength === indent.length) {
        items.splice(indentLevel);
      }
      // Otherwise, indent is either increasing or decreasing
      else {
        indentLevel += (lastIndentLength > indent.length) ? 1 : -1;
      }

      lastIndentLength = indent.length;
      items.push(name);
    }


    return items;
  }
}