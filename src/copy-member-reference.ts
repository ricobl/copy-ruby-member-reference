import * as vscode from 'vscode';
import clipboard from 'clipboardy';

import getMemberReference from './get-member-reference.js';

export default function copyMemberReference() {
  const memberReference = getMemberReference();
  if (!memberReference) {
    vscode.window.showInformationMessage('Failed to find member reference', {modal: true});
    return;
  }

  clipboard.writeSync(memberReference);

  vscode.window.showInformationMessage(`${memberReference} copied to clipboard`, {modal: true});
}
