"use strict";

import { commands } from "../commands.js";
import { cwd } from "../fileState.js";

let lsCommand = commands["ls"];

// TODO:
// implement flags
export function ls() {
  let result = [];
  
  for(let child of cwd.children.values()) {
    let name = child.name;
    let type = child.type;

    result.push({
      name: name,
      type: type
    });
  }

  return result;
}