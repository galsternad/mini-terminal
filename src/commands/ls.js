"use strict";

import { commands } from "../commands.js";
import { cwd } from "../fileState.js";
import { resolvePath } from "../pathResolver.js";
import { isNameUndefinedOrEmpty } from "../helpers.js";
 
let lsCommand = commands["ls"];

// TODO:
// implement flags
export function ls(path, flags) {
  let tmpCwd = cwd;

  if(!isNameUndefinedOrEmpty(path)) {
    tmpCwd = resolvePath(path);
  }
  
  let result = [];
  
  for(let child of tmpCwd.children.values()) {
    let item = {};
    
    item.name = child.name;
    item.type = child.type;

    if(flags.has("l")) {
      item.lastModified = child.lastModified;
      item.size = child.size;
    }

    result.push(item);
  }

  // directory/file only
  if(flags.has("d") && !flags.has("f")) {
    result = result.filter(item => item.type === "directory");
  } else if(flags.has("f") && !flags.has("d")) {
    result = result.filter(item => item.type === "file");
  }

  // sorting
  if(flags.has("T")) {
    result.sort((a, b) => b.lastModified - a.lastModified);
  } else {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}