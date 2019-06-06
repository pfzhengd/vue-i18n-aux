import * as vscode from "vscode";
import * as fs from "fs";
import * as merge from "deepmerge";
import * as path from "path";
import { option } from "./type/option";
import { result } from "./type/result";

export class Common {
  static key: string = "vue-i18n-manage";

  /**
   * Determining whether the value type is undefined.
   *
   * @static
   * @param {*} obj
   * @returns
   * @memberof Common
   */
  static isUndefined(obj: any): boolean {
    return typeof obj === "undefined";
  }

  static isPlainObject(obj: any): boolean {
    return Object.prototype.toString.call(obj) === "[object Object]";
  }

  /**
   * Read the folder and return all the files under the file.
   *
   * @static
   * @memberof Common
   */
  static readdir(path: string | undefined): Array<string> {
    if (this.isUndefined(path)) {
      return [];
    }
    return fs.readdirSync(path || "");
  }

  /**
   * Read the contents of the absolute path file and
   * specify the content to be in JSON format.
   * Otherwise, an exception will occur.
   *
   * @static
   * @param {string} absolutePath
   * @returns {string}
   * @memberof Common
   */
  static readFile(absolutePath: string): object {
    try {
      const content = fs.readFileSync(absolutePath, { encoding: "utf-8" });
      return JSON.parse(content);
    } catch (ex) {
      vscode.window.showErrorMessage(`
        Is read path [${absolutePath}] file when an exception occurs,
        the output format may not be in accordance with the contents of JSON.
      `);
      return {};
    }
  }

  /**
   * Extract the path to the internationalization file in the configuration.
   *
   * @static
   * @returns {string}
   * @memberof Common
   */
  static getConfigPath(): string | undefined {
    return vscode.workspace.getConfiguration(this.key).get("path");
  }

  /**
   * Collect all the language directories in the locale directory.
   *
   * @static
   * @param {string} configPath
   * @returns {Array<string>}
   * @memberof Common
   */
  static getLanguageDirectoryName(): Array<string> {
    const configPath: string = this.getConfigPath() || "";
    const dires: Array<string> = this.readdir(configPath);
    const langNames: Array<string> = [];
    dires.map(dire => {
      const direPath: string = path.resolve(configPath, dire);
      if (fs.statSync(direPath).isDirectory()) {
        langNames.push(dire);
      }
    });
    return langNames;
  }

  /**
   * Get all JSON file content in the specified language directory
   * and merge into a data object.
   *
   * @static
   * @param {string} langName
   * @returns {object}
   * @memberof Common
   */
  static getContent(langName: string): object {
    let data: object = {};
    const configPath: string = this.getConfigPath() || "";
    const direPath: string = path.resolve(configPath, langName);
    const fiels: Array<string> = this.readdir(direPath);
    fiels.map(file => {
      const absolutePath: string = path.resolve(direPath, file);
      data = merge(data, this.readFile(absolutePath));
    });
    return {
      [langName]: data
    };
  }

  /**
   * fetch data
   *
   * @static
   * @returns {object}
   * @memberof Common
   */
  static getData() {
    let data: object = {};
    const direNames: Array<string> = this.getLanguageDirectoryName();
    direNames.map(direName => {
      data = merge(data, this.getContent(direName));
    });
    return data;
  }

  /**
   * Verify that the configured directory is valid.
   *
   * @static
   * @returns {boolean}
   * @memberof Common
   */
  static validConfigPath(): boolean {
    const configPath: string = this.getConfigPath() || "";
    return fs.existsSync(configPath);
  }

  /**
   * Configure the locale directory
   *
   * @static
   * @memberof Common
   */
  static async doConfigLocaleDirectory(): Promise<void> {
    const directory = await vscode.window.showOpenDialog({
      defaultUri: vscode.Uri.file(vscode.workspace.rootPath || ""),
      canSelectFolders: true
    });
    const path: string =
      directory && directory.length > 0 ? directory[0].fsPath : "";
    vscode.workspace.getConfiguration(this.key).update("path", path);
  }

  /**
   * If it is determined that the locale directory is not
   * configured, use the bullet box to prompt the user to configure.
   *
   * @static
   * @returns {Promise<boolean>}
   * @memberof Common
   */
  static async doPromptConfigLocale(): Promise<void> {
    const okText: string = "Setting";
    const result:
      | string
      | undefined = await vscode.window.showInformationMessage(
      `${
        this.key
      }:Did not find your locale directory,please configure it first.`,
      okText
    );
    if (okText === result) {
      this.doConfigLocaleDirectory();
    }
  }

  /**
   * Determine if vue-i18n is included in the project,
   * otherwise the vue-i18n-manage plugin will not be activated.
   *
   * @static
   * @returns {Boolean}
   * @memberof Common
   */
  static hasVueI18n(): boolean {
    const folders = vscode.workspace.workspaceFolders;
    if (folders && folders.length > 0) {
      const projectUri = folders[0].uri.fsPath;
      try {
        const { dependencies, devDependencies } = require(path.resolve(
          projectUri,
          "package.json"
        ));
        return dependencies["vue-i18n"] || devDependencies["vue-i18n"];
      } catch (ex) {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Determine whether the parameters of the text
   * already exists in the international source.
   *
   * @static
   * @param {string} text
   * @returns {boolean}
   * @memberof Common
   */
  static hasText(text: string): boolean {
    const data: object = this.getData();
    const values: Array<string | number | symbol> = Object.values(data);
    return values.hasOwnProperty(text);
  }

  /**
   * Determine whether the parameters of the text
   * already exists in the international source.
   * @static
   * @param {string} text
   * @returns {(object | null)}
   * @memberof Common
   */
  static findSourceByText(text: string): option | null {
    text = text.trim();
    const data: object = this.getData();
    const primaryLanguage: string =
      vscode.workspace.getConfiguration(this.key).get("primaryLanguage") || "";
    if (!primaryLanguage) {
      vscode.window.showErrorMessage(`
      Found primaryLanguage value is not set, this will lead to the same text extraction function failure.
      `);
    }
    if (typeof data[primaryLanguage] === "undefined") {
      vscode.window.showWarningMessage(`
      The internationalization directory for PrimaryLanguage in the configuration file was not found.
      `);
    }
    const result: result = {
      end: false,
      key: [],
      value: ""
    };
    const key: string | undefined = Object.keys(
      data[primaryLanguage] || {}
    ).find(key => {
      // return data[primaryLanguage][key] === text;
      this.deepFind(data[primaryLanguage][key],key, text, result);
      if(!result.end){
        result.key = []
      }

      return result.value.length > 0;
    });

    if (key) {
      return {
        key: result.key.join('.'),
        value: result.value
      };
    }
    return null;
  }

  static deepFind(target: object | string,key:string, text: string, result: result) {
    result.key.push(key);
    if (target === text) {
      result.end = true;
      result.value = target;
    }
    if (this.isPlainObject(target) && !result.end) {
      Object.keys(target).map(partKey => {
        this.deepFind(target[partKey],partKey, text, result);
      });
    }else{
      if(result.end && result.value === target){
       
      }else{
        result.key.pop();
      }
    }
  }
}
