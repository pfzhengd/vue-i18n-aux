import * as vscode from "vscode";

class Config {
  key: string = "vue-i18n-manage";
  get(): string | undefined {
    const value: string | undefined = vscode.workspace
      .getConfiguration(this.key)
      .get("path");
    return value;
  }
  async set(): Promise<void> {
    const directory = await vscode.window.showOpenDialog({
      defaultUri: vscode.Uri.file(vscode.workspace.rootPath || ""),
      canSelectFolders: true
    });
    const path: string =
      directory && directory.length > 0 ? directory[0].fsPath : "";
    vscode.workspace.getConfiguration(this.key).update("path", path);
  }
}

export default () => {
  return vscode.commands.registerCommand("extension.config", () => {
    new Config().set();
  });
};
