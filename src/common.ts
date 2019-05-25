import * as vscode from "vscode";
import * as fs from "fs";
import * as merge from "deepmerge";
import * as path from "path";

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
  static isUndefined(obj: any): Boolean {
    return typeof obj === "undefined";
  }

  /**
   * Read the folder and return all the files under the file.
   *
   * @static
   * @memberof Common
   */
  static readDirectory(path: string | undefined): Array<string> {
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
  static readFileContent(absolutePath: string): object {
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
    const dires: Array<string> = this.readDirectory(configPath);
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
  static getLanguageContent(langName: string): object {
    let data: object = {};
    const configPath: string = this.getConfigPath() || "";
    const direPath: string = path.resolve(configPath, langName);
    const fiels: Array<string> = this.readDirectory(direPath);
    fiels.map(file => {
      const absolutePath: string = path.resolve(direPath, file);
      data = merge(data, this.readFileContent(absolutePath));
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
      data = merge(data, this.getLanguageContent(direName));
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
  static validConfigDirectory(): boolean {
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
  static isHasVueI18n(): Boolean {
    const folders = vscode.workspace.workspaceFolders;
    if (folders && folders.length > 0) {
      const projectUri = folders[0].uri.fsPath;
      try {
        const { dependencies, devDependencies } = require(path.resolve(projectUri, 'package.json'));
        return dependencies["vue-i18n"] || devDependencies['vue-i18n'];
      } catch (ex) {
        return false;
      }
    } else {
      return false;
    }
  }
}
