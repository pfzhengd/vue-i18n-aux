import * as vscode from "vscode";

class Preview implements vscode.HoverProvider {
  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    console.log('document',document.getText());
    const range = document.getWordRangeAtPosition(
      position,
      /(?:\$t|\$tc|\$d|\$n|\$te|this\.t|i18n\.t|[^\w]t)\(['"]([^]+?)['"]/g
    );
    if(!range){
      return undefined;
    }
    const text = document.getText(range);
    const contents = new vscode.MarkdownString("**" + text + "**");
    return new vscode.Hover(contents);
  }
}

export default () => {
  return vscode.languages.registerHoverProvider(
    [
      { language: "vue", scheme: "*" },
      { language: "javascript", scheme: "*" },
      { language: "typescript", scheme: "*" }
    ],
    new Preview()
  );
};
