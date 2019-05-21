import * as vscode from "vscode";

class Config{
 get():string{
   return '';
 }
 set():void{

 }
}

export default () => {
  return vscode.commands.registerCommand('extension.config',()=>{
    new Config();
  })
};
