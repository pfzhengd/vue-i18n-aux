import * as vscode from 'vscode';
import { Common } from './common';

export function activate(context:vscode.ExtensionContext){
  if(vscode.workspace.workspaceFolders && Common.hasVueI18n()){
    // vscode.window.showInformationMessage("vue-i18n-manage is activated.");
    [
      require('./preview').default,
      require('./config').default,
      require('./extracted').default
    ].map(module=>{
      context.subscriptions.push(module());
    });
  }else{
    return vscode.commands.registerCommand("extension.config", () => {
      vscode.window.showWarningMessage(`
      Vue-i18n is not installed in the project.Please install the vue-i18n dependency package first.
      `);
    });
  }
}

export function deactivate() {}