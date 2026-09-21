"use strict";

import { cwd } from "../fileState.js";

function buildTreeString(child, depth) {
  let result = "";
  const indent = 2;

  // indent
  for(let i = 0; i < depth * indent; i++) {
    result += " ";
  }

  result += child.name;

  if(child.type === "directory") {
    result += "/";
  }

  result += "\n";

  return result;
}

function callTreeRecursive(directory, str, depth) {
  for(let child of directory.children.values()) {
    str += buildTreeString(child, depth);
    
    if(child.type === "directory") {
      str = callTreeRecursive(child, str, depth + 1);
    }
  }

  return str;
}

// TODO:
// sort by alphabet
export function tree() {
  let directory = cwd;
  let directoryName = "";
  const depth = 0;

  let result = callTreeRecursive(directory, directoryName, depth);

  return result.slice(0, result.length - 1);
}