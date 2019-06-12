import * as vscode from "vscode";
import { Common } from "./common";
import * as path from 'path';
import * as fs from "fs";
class Config {
  key: string = "vue-i18n-manage";
  get(): string | undefined {
    const value: string | undefined = vscode.workspace
      .getConfiguration(this.key)
      .get("localePath");
    return value;
  }
  async set(): Promise<void> {
    const directory = await vscode.window.showOpenDialog({
      defaultUri: vscode.Uri.file(vscode.workspace.rootPath || ""),
      canSelectFolders: true
    });
    const path: string =
      directory && directory.length > 0 ? directory[0].fsPath : "";
    vscode.workspace.getConfiguration(this.key).update("localePath", path);
  }

  init():void{
    const i18nPath:string | undefined = this.get();
    if(!i18nPath){
      const defaultPath:string = Common.getDefaultPath();
      if(defaultPath && fs.existsSync(defaultPath)){
        vscode.workspace.getConfiguration(this.key).update("localePath", defaultPath);
        vscode.window.showInformationMessage('Vue-i18n-manage found the locale directory path.');
      }else{
        if (!Common.validConfigPath()) {
          Common.doPromptConfigLocale();
        }
      }
    }else{
      if (!Common.validConfigPath()) {
        Common.doPromptConfigLocale();
      }
    }
  }
}

export default () => {
  const config = new Config();
  config.init();
  return vscode.commands.registerCommand("extension.config", () => {
    new Config().set();
  });
};
