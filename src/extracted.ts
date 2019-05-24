import * as vscode from "vscode";
import * as path from "path";
import { Common } from "./common";
import * as fs from 'fs';

const enum I18nType {
  $t,
  i18n
}

class Extracted implements vscode.CodeActionProvider {
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ) {
    const text: string = document.getText(range);
    if (!text) {
      return [];
    }
    let { base } = path.parse(document.fileName);
    base = base.replace(document.languageId, 'json');
    return [
      {
        command: "extension.converter",
        title: "Extracted the text as $t",
        arguments: [
          {
            fileName: base,
            range: range,
            text: text,
            type: I18nType.$t
          }
        ]
      },
      {
        command: "extension.converter",
        title: "Extracted the text as i18n.t",
        arguments: [
          {
            fileName: base,
            range: range,
            text: text,
            type: I18nType.i18n
          }
        ]
      }
    ];
  }
}


function replaceContent(key: string|undefined, range: vscode.Range,type:I18nType): void {
  (vscode.window.activeTextEditor as vscode.TextEditor).edit(editBuilder => {
    const value = I18nType.$t === type? `{{$t("${key}")}}` : `this.$t("${key}")`;
    editBuilder.replace(range, value);
  });
}

function writeContent(fileName:string,key:string,value:string):void{
  const configPath:string = Common.getConfigPath() || "";
  const direNames:Array<string> = Common.getLanguageDirectoryName();
  direNames.map(direName=>{
    const absolutePath:string = path.resolve(configPath,direName,fileName);
    let data:object = {};
    if(fs.existsSync(absolutePath)){
      data = Common.readFileContent(absolutePath);
    }
    data[key] = value;
    fs.writeFileSync(absolutePath,JSON.stringify(data),{encoding:'utf-8'});
  });
}

async function converter({ fileName, text, range, type }):Promise<void> {
  let key: string | undefined = undefined;
  key = await vscode.window.showInputBox({
    placeHolder: "Enter the key to be converted,for example:lang.demo.key"
  });
  if(key){
    replaceContent(key,range,type);
    writeContent(fileName,key,text);
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
