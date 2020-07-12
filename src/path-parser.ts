// import * as vscode from 'vscode';

export class Member {
  type: string;
  name: string;

  constructor(type: string, name: string) {
    this.type = type;
    this.name = name;
  }

  get separator(): string {
    if (this.type === 'def') {
      return '#';
    }
    else if (this.type === 'selfdef') {
      return '.';
    }
    return '::';
  }
}

export class PathParser {
  source: string;

  constructor(source: string) {
    this.source = source;
  }

  parse() : Array<Member> {
    return this.members();
  }

  members() : Array<Member> {
    const membersRegex = /^(?:\n*)(\s*)(class|module|def)(?:\s+)(self\.)?([\w:]+)/gm;
    const matches = this.source.matchAll(membersRegex);

    const items : Array<Member> = [];
    let lastIndentLength = 0;
    let indentLevel = 0;

    for (let [_match, indent, type, self, name] of matches) {
      // Remove any previous items on the same level
      if (lastIndentLength === indent.length) {
        items.splice(indentLevel);
      }
      // Otherwise, indent is either increasing or decreasing
      else {
        indentLevel += (lastIndentLength > indent.length) ? 1 : -1;
      }

      lastIndentLength = indent.length;
      type = self ? 'selfdef' : type;
      items.push(new Member(type, name));
    }

    return items;
  }
}