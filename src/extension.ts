import * as vscode from 'vscode';

let statusBar: vscode.StatusBarItem;

function countStats(text: string) {
  const trimmed = text.trim();
  return {
    chars: text.length,
    words: trimmed === '' ? 0 : trimmed.split(/\s+/).length,
    lines: text === '' ? 0 : text.split(/\r?\n/).length,
  };
}

function toSnake(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

function toCamel(s: string): string {
  return toSnake(s).replace(/_+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
}

function transformSelection(fn: (s: string) => string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('Нет открытого файла');
    return;
  }
  editor.edit(builder => {
    for (const sel of editor.selections) {
      builder.replace(sel, fn(editor.document.getText(sel)));
    }
  });
}

function updateStatusBar() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    statusBar.hide();
    return;
  }
  const { words } = countStats(editor.document.getText());
  statusBar.text = `$(pencil) Слов: ${words}`;
  statusBar.show();
}

export function activate(context: vscode.ExtensionContext) {
  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  context.subscriptions.push(statusBar);

  context.subscriptions.push(
    vscode.commands.registerCommand('text-toolkit.showStats', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('Нет открытого файла');
        return;
      }
      const s = countStats(editor.document.getText());
      vscode.window.showInformationMessage(
        `Строк: ${s.lines}, слов: ${s.words}, символов: ${s.chars}`
      );
    }),

    vscode.commands.registerCommand('text-toolkit.toSnakeCase', () => transformSelection(toSnake)),
    vscode.commands.registerCommand('text-toolkit.toCamelCase', () => transformSelection(toCamel)),

    vscode.commands.registerCommand('text-toolkit.insertDate', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) { return; }
      const date = new Date().toLocaleDateString('ru-RU');
      editor.edit(b => b.insert(editor.selection.active, date));
    }),

    vscode.window.onDidChangeActiveTextEditor(updateStatusBar),
    vscode.workspace.onDidChangeTextDocument(updateStatusBar)
  );

  updateStatusBar();
}

export function deactivate() {}