"use strict";

import { cwd, ROOT } from "../fileState.js";

function buildFindString(child) {
  let currentWorkingDirectory = child.parent;
  let result = [];
  
  if(currentWorkingDirectory === ROOT) {
    return "/" + child.name + "\n";
  }
  
  result.push(currentWorkingDirectory.name);
  
  while(currentWorkingDirectory.parent != null) {
    currentWorkingDirectory = currentWorkingDirectory.parent;
    result.push(currentWorkingDirectory.name);
  }

  
  result = result.reverse();
  result.push(child.name);
  console.log(result);

  return result;
}

function callFindRecursive(target, currentDirectory, str) {
  for(let child of currentDirectory.children.values()) {
    if(child.name.includes(target)) {
      str += buildFindString(child);
    }
    
    if(child.type === "directory") {
      str = callFindRecursive(target, child, str);
    }
  }
  
  return str;
}

export function find(target) {
  let currentDirectory = cwd;
  let result = callFindRecursive(target, currentDirectory, "");

  if(result.length === 0) {
    return `Couldn't find '${target}'!`;
  }

  return `Found '${target}':\n` + result.slice(0, result.length - 1);
}