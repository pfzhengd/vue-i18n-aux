import * as vscode from "vscode";

class Source {
  constructor() {
    this.init();
  }
  async init() {
    const dirs = await vscode.window.showOpenDialog({
      defaultUri:vscode.Uri.file(vscode.workspace.rootPath||''),
      canSelectFolders:true
    });
  }
}

export default () => {
  return vscode.commands.registerCommand('extension.config',()=>{
    new Source();
  })
};
