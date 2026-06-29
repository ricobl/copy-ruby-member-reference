interface MemberOptions {
  type: string;
  name: string;
  separator: string;
  matcher: Matcher;
}

export class Member {
  type: string;
  name: string;
  separator: string;
  matcher: Matcher;

  constructor({type, name, separator, matcher} : MemberOptions) {
    this.type = type;
    this.name = name;
    this.separator = separator;
    this.matcher = matcher;
  }
}

interface MatcherOptions {
  type: string;
  expression: string;
  separator?: string;
  requiredParent?: string;
  promoteParentType?: string;
}

class Matcher {
  type: string;
  expression: string;
  separator: string;
  requiredParent: string | undefined;
  promoteParentType: string | undefined;

  constructor({type, expression, separator='::', requiredParent, promoteParentType}: MatcherOptions) {
    this.type = type;
    this.expression = expression;
    this.separator = separator;
    this.requiredParent = requiredParent;
    this.promoteParentType = promoteParentType;
  }

  matchLine(line: string, parent: Member | undefined) : Member | null {
    const regex = new RegExp(this.expression);
    const match = line.match(regex);
    if (!match) {
      return null;
    }

    if (!this.matchesRequiredParent(parent)) {
      return null;
    }

    const [_, name] = match;
    return new Member({
      type: this.type,
      name: name || '',
      separator: this.separator,
      matcher: this,
    });
  }

  matchesRequiredParent(parent: Member | undefined) : Boolean {
    if (!parent || !this.requiredParent) {
      return true;
    }
    return (this.requiredParent === parent.type);
  }
}

const MATCHERS = [
  // CLASSES / MODULES
  new Matcher({type: 'class', expression: 'class\\s+([\\w:]+)'}),
  new Matcher({type: 'module', expression: 'module\\s+([\\w:]+)'}),
  new Matcher({type: 'class_method', expression: 'def\\s+self\.([\\w]+[!=\?]?)', separator: '.'}),
  new Matcher({type: 'class_self', expression: 'class << self', separator: ''}),

  // MODIFIERS — change parent member's type so subsequent matchers key off it
  new Matcher({
    type: 'extend_self',
    expression: 'extend self\\b',
    separator: '',
    promoteParentType: 'extend_self_scope',
  }),
  new Matcher({
    type: 'module_function',
    // Ensure not to match against `module_function :method_name`
    expression: 'module_function\\b(?!\\s*:\\s*\\w)',
    separator: '',
    promoteParentType: 'module_function_scope',
  }),

  // SCOPED METHODS — match bare `def name` when parent type was modified
  new Matcher({
    type: 'scoped_method',
    expression: 'def\\s+([\\w]+[!=\\?]?)',
    separator: '.',
    requiredParent: 'extend_self_scope',
  }),
  new Matcher({
    type: 'scoped_method',
    expression: 'def\\s+([\\w]+[!=\\?]?)',
    separator: '.',
    requiredParent: 'module_function_scope',
  }),

  // CLASS METHODS
  new Matcher({
    type: 'inline_class_method',
    expression: 'private_class_method def\\s+self\.([\\w]+[!=\?]?)',
    separator: '.'
  }),
  new Matcher({
    type: 'class_self_method',
    expression: 'def\\s+([\\w]+[!=\\?]?)',
    separator: '.',
    requiredParent: 'class_self',
  }),

  // INSTANCE / CONSTANTS
  new Matcher({type: 'instance_method', expression: 'def\\s+([\\w]+[!=\\?]?)', separator: '#'}),
  new Matcher({type: 'constant', expression: '([A-Z][\\w]*)\\s+='}),

  // RAKE TASKS
  new Matcher({type: 'rake_namespace', expression: 'namespace \:([\\w]+)'}),
  new Matcher({
    type: 'rake_task',
    expression: 'task \:?([\\w]+)',
    separator: ':',
  }),
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

      this.currentMember = this.nextMember(line, this.parentMember());

      if (this.currentMember?.matcher.promoteParentType) {
        this.promoteParent(this.currentMember.matcher.promoteParentType);
        continue;
      }

      if (!this.currentMember) {
        continue;
      }

      this.memberPath.push(this.currentMember);
    }
  }

  nextMember(line: string, parent: Member | undefined): Member | undefined {
    let member: Member | undefined;
    MATCHERS.find(m => {
      const result = m.matchLine(line, parent);
      if (result) {member = result;}
      return result !== null;
    });
    return member;
  }

  promoteParent(type: string): undefined {
    const parent = this.parentMember();
    if (!parent) {
      return;
    }

    parent.type = type;
  }

  parentMember(): Member | undefined {
    return this.memberPath[this.memberPath.length - 1];
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
