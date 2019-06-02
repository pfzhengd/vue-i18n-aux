import LinkedList from "small-linked-list";
import { Node } from "./type/node";

class Compiler {
  constructor() {}
  toObject(key: string, value: any): object {
    const partKeys: Array<string> = key.split(".");
    const linkedList = new LinkedList.default();
    const obj = {};
    partKeys.map(partKey => {
      linkedList.append(partKey);
    });
    this.findProperty(linkedList.head, obj, value);
    return obj;
  }
  toText(key: string, source: object): string {
    const partKeys: Array<string> = key.split(".");
    const linkedList = new LinkedList.default();

    partKeys.map(partKey => {
      linkedList.append(partKey);
    });
    let value: any = this.findValue(linkedList.head, source);
    return value;
  }
  private findProperty(node: Node, target: object, value: any) {
    if (!target[node.element]) {
      target[node.element] = {};
    }
    if (node.next) {
      this.findProperty(node.next, target[node.element], value);
    } else {
      target[node.element] = value;
    }
  }
  private findValue(node: Node, target: object) {
    if (!target[node.element]) {
      return "";
    }
    if (node.next) {
      return this.findValue(node.next, target[node.element]);
    } else {
      return target[node.element];
    }
  }
}

export default Compiler;
