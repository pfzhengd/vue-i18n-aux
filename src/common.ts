import * as vscode from "vscode";
import * as fs from "fs";
import * as merge from "deepmerge";
import * as path from "path";

export class Common {
  /**
   * Determining whether the value type is undefined.
   *
   * @static
   * @param {*} obj
   * @returns
   * @memberof Common
   */
  static isUndefined(obj: any) {
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
  static readFileContent(absolutePath: string):string {
    try {
      const content = fs.readFileSync(absolutePath, { encoding: "utf-8" });
      return JSON.parse(content);
    } catch (ex) {
      vscode.window.showErrorMessage(`
        Is read path [${absolutePath}] file when an exception occurs,the output format may not be in accordance with the contents of JSON.
      `);
      return '';
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
    return vscode.workspace.getConfiguration("vue-i18n-manage").get("path");
  }

  /**
   * fetch data
   *
   * @static
   * @returns {object}
   * @memberof Common
   */
  static getData() {
    const configPath: string = this.getConfigPath() || "";
    const fiels: Array<string> = this.readDirectory(configPath);
    let data = {};

    fiels.map(file => {
      const absolutePath: string = path.resolve(configPath, file);
      data = merge(data, this.readFileContent(absolutePath));
    });

    return data;
  }
}
