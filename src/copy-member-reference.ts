import * as vscode from 'vscode';

import getMemberReference from './get-member-reference.js';

export default async function copyMemberReference() {
  const memberReference = getMemberReference();
  if (!memberReference) {
    vscode.window.showInformationMessage('Failed to find member reference', {modal: true});
    return;
  }

  await vscode.env.clipboard.writeText(memberReference);

  vscode.window.showInformationMessage(`${memberReference} copied to clipboard`, {modal: true});
}
