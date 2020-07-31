// import * as vscode from 'vscode';

interface MemberOptions {
  type: string;
  name: string;
  separator: string;
}

export class Member {
  type: string;
  name: string;
  separator: string;

  constructor({type, name, separator} : MemberOptions) {
    this.type = type;
    this.name = name;
    this.separator = separator;
  }
}

interface MatcherOptions {
  type: string;
  expression: string;
  separator?: string;
}

class Matcher {
  type: string;
  expression: string;
  separator: string;

  constructor({type, expression, separator='::'}: MatcherOptions) {
    this.type = type;
    this.expression = expression;
    this.separator = separator;
  }

  matchLine(line: string) : Member | null {
    const regex = new RegExp(this.expression);
    const match = line.match(regex);
    if (!match) {
      return null;
    }

    const [_, name] = match;
    return new Member({
      type: this.type,
      name: name || '',
      separator: this.separator
    });
  }
}

const MATCHERS = [
  new Matcher({type: 'class', expression: 'class\\s+([\\w:]+)'}),
  new Matcher({type: 'module', expression: 'module\\s+([\\w:]+)'}),
  new Matcher({type: 'class_method', expression: 'def\\s+self\.([\\w:]+)', separator: '.'}),
  new Matcher({type: 'instance_method', expression: 'def\\s+([\\w:]+)', separator: '#'}),
  new Matcher({type: 'constant', expression: '([A-Z]+)\\s+'}),
];

export class PathParser {
  source: string;

  constructor(source: string) {
    this.source = source;
  }

  parse() : Array<Member> {
    return this.members();
  }

  matchingLines() : IterableIterator<RegExpMatchArray> {
    const combinedMatchersExpression = MATCHERS.map(m => m.expression).join('|');
    const linesExpression = new RegExp(
      `^(?:\\n*)(\\s*)(${combinedMatchersExpression})`,
      'gm'
    );
    return this.source.matchAll(linesExpression);
  }

  members() : Array<Member> {
    const matches = this.matchingLines();

    const items : Array<Member> = [];
    let lastIndentLength = 0;
    let indentLevel = 0;
    let lineMatcher;
    let member;

    for (let [_match, indent, line] of matches) {
      lineMatcher = this.lineMatcher(line);
      if (!lineMatcher) {
        continue;
      };

      member = lineMatcher.matchLine(line);
      if (!member) {
        continue;
      };

      // Remove any previous items on the same level
      if (lastIndentLength === indent.length) {
        items.splice(indentLevel);
      }
      // Otherwise, indent is either increasing or decreasing
      else {
        indentLevel += (lastIndentLength > indent.length) ? 1 : -1;
      }

      lastIndentLength = indent.length;
      items.push(member);
    }

    return items;
  }

  lineMatcher(line: string): Matcher | undefined {
    return MATCHERS.find(m => m.matchLine(line) !== null);
  }
}