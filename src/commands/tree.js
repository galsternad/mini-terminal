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

function callTreeRecursive(currentDirectory, result, depth) {
  for(let child of currentDirectory.children.values()) {
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
  
  let currentDirectory = cwd;
  const depth = 0;

  result = callTreeRecursive(currentDirectory, result, depth);

  return result;
}