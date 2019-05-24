import * as vscode from 'vscode';

export function activate(context:vscode.ExtensionContext){
  vscode.window.showInformationMessage("vue-i18n-manage is activated.");
  [
    require('./preview').default,
    require('./config').default,
    require('./extracted').default
  ].map(module=>{
    context.subscriptions.push(module());
  });
}

export function deactivate() {}