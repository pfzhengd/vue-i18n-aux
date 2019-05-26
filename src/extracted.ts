import * as vscode from "vscode";
import * as path from "path";
import { Common } from "./common";
import * as fs from 'fs';
import { option } from "./type/option";

const enum I18nType {
  $t,
  i18n
}

class Extracted implements vscode.CodeActionProvider {
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ) {
    const text: string = document.getText(range);
    if (!text) {
      return [];
    }
    let { base } = path.parse(document.fileName);
    base = base.replace(document.languageId, 'json');
    const hasText: option | null = Common.findSourceByText(text);

    let args = [
      {
        command: "extension.converter",
        title: hasText ? `Reference [${hasText.key}] as $t` : "Extracted the text as $t",
        arguments: [
          {
            fileName: base,
            range: range,
            text: text,
            reference: hasText,
            type: I18nType.$t
          }
        ]
      },
      {
        command: "extension.converter",
        title: hasText ? `Reference [${hasText.key}] as i18n.t` : "Extracted the text as i18n.t",
        arguments: [
          {
            fileName: base,
            range: range,
            text: text,
            reference: hasText,
            type: I18nType.i18n
          }
        ]
      }
    ];
    return args;
  }
}


function replaceContent(key: string | undefined, range: vscode.Range, type: I18nType): void {
  (vscode.window.activeTextEditor as vscode.TextEditor).edit(editBuilder => {
    const value = I18nType.$t === type ? `{{$t("${key}")}}` : `this.$t("${key}")`;
    editBuilder.replace(range, value);
  });
}

function writeContent(fileName: string, key: string, value: string): void {
  const configPath: string = Common.getConfigPath() || "";
  const direNames: Array<string> = Common.getLanguageDirectoryName();
  direNames.map(direName => {
    const absolutePath: string = path.resolve(configPath, direName, fileName);
    let data: object = {};
    if (fs.existsSync(absolutePath)) {
      data = Common.readFileContent(absolutePath);
    }
    data[key] = value;
    fs.writeFileSync(absolutePath, JSON.stringify(data), { encoding: 'utf-8' });
  });
}

async function converter({ fileName, text, range, type, reference }): Promise<void> {
  if (reference) {
    replaceContent(reference.key,range,type);
  } else {
    let key: string | undefined = undefined;
    key = await vscode.window.showInputBox({
      placeHolder: "Enter the key to be converted,for example:lang.demo.key"
    });
    if (key) {
      replaceContent(key, range, type);
      writeContent(fileName, key, text);
    }
  }
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
