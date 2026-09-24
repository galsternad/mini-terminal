"use strict";

import { commands } from "../commands.js";
import { cwd } from "../fileState.js";
import { resolvePath } from "../pathResolver.js";
import { DirectorySystemError } from "../constructors/Error.js";
import { DIRECTORY_INVALID_NAME } from "../processCodes.js";
 
let lsCommand = commands["ls"];

// TODO:
// implement flags
export function ls(path, flags) {
  let tmpCwd = cwd;

  if(path !== undefined) {
    tmpCwd = resolvePath(path);
  }
  
  let result = [];
  
  for(let child of tmpCwd.children.values()) {
    let name = child.name;
    let type = child.type;

    result.push({
      name: name,
      type: type
    });
  }

  return result;
}