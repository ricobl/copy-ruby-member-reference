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
  new Matcher({type: 'constant', expression: '([A-Z][\\w]*)\\s+='}),
];

export class PathParser {
  source: string;
  memberPath: Array<Member> = [];
  lastIndentLength: number = 0;
  indentLevel: number = 0;
  currentMember: Member | undefined;

  constructor(source: string) {
    this.source = source;
  }

  parse() : Array<Member> {
    this.buildMemberPath();
    return this.memberPath;
  }

  matchingLines() : IterableIterator<RegExpMatchArray> {
    const combinedMatchersExpression = MATCHERS.map(m => m.expression).join('|');
    const linesExpression = new RegExp(
      `^(?:\\n*)(\\s*)(${combinedMatchersExpression})`,
      'gm'
    );
    return this.source.matchAll(linesExpression);
  }

  buildMemberPath() {
    for (let [_match, indent, line] of this.matchingLines()) {
      this.currentMember = this.nextMember(line);
      if (!this.currentMember) {
        continue;
      }

      if (this.lastIndentLength === indent.length) {
        this.removeMembersOnCurrentLevel();
      }
      else if (this.lastIndentLength > indent.length) {
        this.dedent();
        this.removeMembersOnCurrentLevel();
      }
      else {
        this.indent();
      }

      this.lastIndentLength = indent.length;

      this.memberPath.push(this.currentMember);
    }
  }

  nextMember(line: string): Member | undefined {
    let member;
    MATCHERS.find(m => member = m.matchLine(line));
    return member;
  }

  removeMembersOnCurrentLevel() {
    this.memberPath.splice(this.indentLevel);
  }

  indent() {
    this.indentLevel++;
  }

  dedent() {
    this.indentLevel--;
  }
}
