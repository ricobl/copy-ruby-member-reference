// import * as vscode from 'vscode';

export class ReferenceParser {
  source: string;

  constructor(source: string) {
    this.source = source;
  }

  parse() : Array<string> {
    let membersRegex = /(class|module)(\s+)(\w+)/gm;
    let matches = [...this.source.matchAll(membersRegex)];
    return matches.map(m => m[3]);
  }
}