"use strict";

import { cwd, ROOT } from "./fileState.js";

export function isRootDirectory() {
  return cwd === ROOT;
}

export function isDirectory(directoryName) {
  return cwd.children.get(directoryName).type === "directory";
}

export function checkIfDirectoryOrFileExists(name) {
  return cwd.children.has(name);
}

export function checkIfDirectoryExists(directoryName) {
  return cwd.children.has(directoryName) && isDirectory(directoryName);
}

export function isFile(fileName) {
  return cwd.children.get(fileName).type === "file";
}

export function checkIfFileExists(fileName) {
  return cwd.children.has(fileName) && isFile(fileName);
}

export function getDirectory(directoryName) {
  if(!checkIfDirectoryExists(directoryName)) {
    return null;
  }

  return cwd.children.get(directoryName);
}

export function canRemoveDirectory(directoryName) {
  let directory = getDirectory(directoryName);

  if(directory === null) {
    return false;
  }

  if(directory.children.size !== 0) {
    console.log(`Cannot delete a non-empty directory!`);
    
    return false;
  }

  return true;
}

export function getFile(fileName) {
  if(!checkIfFileExists(fileName)) {
    return null;
  }

  return cwd.children.get(fileName)
}

export function canRemoveFile(fileName) {
  let file = getFile(fileName);

  if(file === null) {
    return false;
  }

  return true;
}

export function getHelpString(command) {
  let helpString = "";
  helpString += `${command["description"]}\n${command["usage"]}\n\nOptions:\n`;

  for(let flag of Object.values(command["flags"])) {
    helpString += `${flag}\n`;
  }

  return helpString;
}

export function createResultObject(command, type, data) {
  return {
    command: command,
    type: type,
    data: data
  };
}