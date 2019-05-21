import * as vscode from "vscode";

class Config{
 key:string = 'vue-i18n-manage';
 get():string|undefined{
   const value:string | undefined = vscode.workspace.getConfiguration(this.key).get('paths');
   return value;
 }
 async set():Promise<void>{
  const dirs =await vscode.window.showOpenDialog({
    defaultUri:vscode.Uri.file(vscode.workspace.rootPath||''),
    canSelectFolders:true
  });
  vscode.workspace.getConfiguration(this.key).update('paths',dirs);
 }
}

export default () => {
  return vscode.commands.registerCommand('extension.config',()=>{
    new Config().set();
  })
};
