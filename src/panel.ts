import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export default (context:vscode.ExtensionContext)=>{
  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  vscode.commands.registerCommand("catCoding.start", () => {
    const columnToShowIn = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (currentPanel) {
      currentPanel.reveal(columnToShowIn);
    } else {
      // Create and show a new webview
      currentPanel = vscode.window.createWebviewPanel(
        "catCoding",
        "Cat Coding",
        vscode.ViewColumn.One,
        {
          enableScripts: true
        }
      );
    }

    // currentPanel.webview.html = getWebViewContent();
    currentPanel.webview.html = fs.readFileSync(
      path.resolve(__dirname,'../src/static/lang.html'),
      'utf-8'
    );

    currentPanel.onDidDispose(
      () => {
        currentPanel = undefined;
      },
      null,
      context.subscriptions
    );

    currentPanel.onDidChangeViewState(
      event => {
        console.log("event.changed", event.webviewPanel);
      },
      null,
      context.subscriptions
    );
    
    currentPanel.webview.onDidReceiveMessage(message=>{
      switch (message.command) {
        case 'alert':
            vscode.window.showErrorMessage(message.text);
          return;
      }
    },undefined,context.subscriptions);
  })
}