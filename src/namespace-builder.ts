// import * as vscode from 'vscode';

import { PathParser } from "./path-parser";

export class NamespaceBuilder {
  source: string;
  parser: PathParser;

  constructor(source: string) {
    this.source = source;
    this.parser = new PathParser(source);
  }

  build() : string {
    return this.parser.parse().map(m => m.name).join('::');
  }
}