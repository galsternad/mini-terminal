"use strict";

import { cwd } from "../fileState.js";

function buildTreeString(child, depth) {
  let result = {};

  result = {
    name: child.name,
    type: child.type,
    depth: depth
  };

  return result;
}

function callTreeRecursive(directory, result, depth) {
  for(let child of directory.children.values()) {
    result.push(buildTreeString(child, depth));
    
    if(child.type === "directory") {
      result = callTreeRecursive(child, result, depth + 1);
    }
  }

  return result;
}

// TODO:
// sort by alphabet
export function tree(options, flags) {
  let result = [];
  
  let directory = cwd;
  const depth = 0;

  result = callTreeRecursive(directory, result, depth);

  return result;
}