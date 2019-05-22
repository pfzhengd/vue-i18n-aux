import * as vscode from 'vscode';
export function deactivate() {}
export function activate(context:vscode.ExtensionContext){
  [
    require('./preview').default,
    require('./config').default
  ].map(module=>{
    context.subscriptions.push(module());
  });
}