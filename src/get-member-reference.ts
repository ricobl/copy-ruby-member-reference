import * as vscode from 'vscode';
import { Range, Position } from 'vscode';

import { NamespaceBuilder } from './namespace-builder';

export default function getMemberReference() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const {document, selection} = editor;

  const currentWordSelection = document.getWordRangeAtPosition(selection.active);
  if (!currentWordSelection) {
    return;
  }

  const linesUpToSelection = document.getText(new Range(new Position(0, 0), currentWordSelection.end));
  const builder = new NamespaceBuilder(linesUpToSelection);
  return builder.build();
}