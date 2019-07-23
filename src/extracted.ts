import * as vscode from "vscode";
import * as path from "path";
import { Common } from "./common";
import * as fs from "fs";
import Compiler from "./compiler";
import * as merge from "deepmerge";
import { EnterKey } from "./type/enterKey";

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
    //Fix:https://github.com/pfzhengd/vue-i18n-manage/issues/3
    if (!Common.validConfigPath()) {
      Common.doPromptConfigLocale();
    }
    let { base } = path.parse(document.fileName);
    base = base.replace(document.languageId, "json");
    const hasText: object | null = Common.findSourceByText(text);

    let args = [
      {
        command: "extension.converter",
        title: hasText
          ? `Reference [${hasText}] as $t`
          : "Extracted the text as $t",
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
        title: hasText
          ? `Reference [${hasText}] as this.$t`
          : "Extracted the text as this.$t",
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

function replaceContent(key: string | undefined,
  range: vscode.Range,
  type: I18nType): void {
  (vscode.window.activeTextEditor as vscode.TextEditor).edit(editBuilder => {
    const value =
      I18nType.$t === type ? `{{$t("${key}")}}` : `this.$t("${key}")`;
    if (type === I18nType.i18n) {
      range = range.with(
        range.start.with(range.start.line, range.start.character - 1),
        range.end.with(range.end.line, range.end.character + 1)
      );
    }
    editBuilder.replace(range, value);
  });
}

function writeContent(fileName: string, key: string, value: string): void {
  const configPath: string = Common.getConfigPath() || "";
  const direNames: Array<string> = Common.getLanguageName();
  direNames.map(direName => {
    const absolutePath: string = path.resolve(configPath, direName, fileName);
    let data: object = {};
    if (fs.existsSync(absolutePath)) {
      data = Common.readFile(absolutePath);
    }
    const compiler = new Compiler();
    const obj: object = compiler.toObject(key, value);
    const mergeData: object = merge(data, obj);
    fs.writeFileSync(absolutePath, JSON.stringify(mergeData, null, 2), {
      encoding: "utf-8",
    });
  });
}

function parseKey(key: string): EnterKey | null {
  const regKey = /(^[^:]+(?:\:))((?<=\:).+)/i;
  const result: RegExpMatchArray | null = key.match(regKey);
  if (result && result.length > 2) {
    return {
      i18n: result[2],
      fileName: result[1]
    };
  }
  return null;
}

async function convert({
  fileName,
  text,
  range,
  type,
  reference
}): Promise<void> {
  if (reference) {
    replaceContent(reference.key, range, type);
  } else {
    let key: string | undefined = undefined;
    key = await vscode.window.showInputBox({
      placeHolder: "Enter the key to be converted,for example:lang.demo.key",
      value:Common.getDefaultFileName()
    });
    if (key) {
      const enterKey: EnterKey | null = parseKey(key);
      if (enterKey) {
        key = enterKey.i18n;
        fileName = enterKey.fileName.replace(":", ".json");
        Common.updateDefaultFileName(enterKey.fileName);
      }
      const data = Common.getData();
      let hasKey: boolean = false;
      Object.keys(data).map((langType: string) => {
        const compiler = new Compiler();
        const source = data[langType];
        const value = compiler.toText(String(key), source);
        if (value) {
          hasKey = true;
          return;
        }
      });
      if (hasKey) {
        const yes = "OK";
        const receiveText = await vscode.window.showWarningMessage(
          `The currently set ${key} already exists, you can try to modify it, if you need to override click OK.`,
          {
            modal: true
          },
          yes
        );
        if (String(receiveText) === yes) {
          hasKey = false;
        }
      }
      if (!hasKey) {
        replaceContent(key, range, type);
        writeContent(fileName, key, text);
      }
    }
  }
}

export default () => {
  const extracted = new Extracted();
  return [
    vscode.languages.registerCodeActionsProvider(
      [
        { language: "vue", scheme: "*" },
        { language: "javascript", scheme: "*" },
        { language: "typescript", scheme: "*" }
      ],
      extracted
    ),
    vscode.commands.registerCommand("extension.converter", convert)
  ];
};
