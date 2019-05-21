import * as vscode from "vscode";

class Preview implements vscode.HoverProvider {
  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const i18nKey:string = this.getI18nkey(document,position);
    const i18nValues:Array<string> = this.getI18nValue(i18nKey);
    const text:string = this.render(i18nValues);
    const contents:vscode.MarkdownString = new vscode.MarkdownString(text);
    return new vscode.Hover(contents);
  }
  getI18nkey(document:vscode.TextDocument,position:vscode.Position):string{
    console.log(document.getText());
    const range:vscode.Range|undefined = document.getWordRangeAtPosition(position,/\$t\([^\)]+\)/ig);
    if(!range){
      return '';
    }
    const text:string = document.getText(range);
    return text.replace(/\$t|\(|\)/ig,'');
  }
  getI18nValue(i18nKey:string):Array<string>{
    return [];
  }
  render(i18nValue:Array<string>):string{
    return '**render**';
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
