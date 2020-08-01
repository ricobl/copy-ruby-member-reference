import { ExtensionContext, commands } from 'vscode';

import copyMemberReference from './copy-member-reference';

export function activate(context: ExtensionContext) {
	context.subscriptions.push(
    commands.registerCommand('copy-ruby-member-reference.copyReference', copyMemberReference)
  );
}

export function deactivate() {};