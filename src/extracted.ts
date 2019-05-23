import * as vscode from "vscode";

class Extracted implements vscode.CodeActionProvider {
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ) {
    return [
      {
        command: "extension.converter",
        title: "Extracted the text as $t"
      },
      {
        command: "extension.converter",
        title: "Extracted the text as i18n.t"
      }
    ];
  }
}

async function converter() {
  let key: string | undefined = undefined;
  key = await vscode.window.showInputBox({
    placeHolder: "Enter the key to be converted,for example:lang.demo.key"
  });
}

export default () => {
  return [
    vscode.languages.registerCodeActionsProvider(
      [
        { language: "vue", scheme: "*" },
        { language: "javascript", scheme: "*" },
        { language: "typescript", scheme: "*" }
      ],
      new Extracted()
    ),
    vscode.commands.registerCommand("extension.converter", converter)
  ];
};
