"use strict";

import { cwd, ROOT } from "./fileState.js";
import { commands } from "./commands.js";
import { FlagError } from "./constructors/Error.js";
import { FLAG_NOT_FOUND, FLAGS_PARSED_SUCCESSFULLY } from "./processCodes.js";

export function isRootDirectory() {
  return cwd === ROOT;
}

export function isNameUndefinedOrEmpty(name) {
  return name === undefined || name.trim() === "";
}

export function isDirectory(directoryName, tmpCwd) {
  return tmpCwd.children.get(directoryName).type === "directory";
}

export function checkIfDirectoryOrFileExists(name, tmpCwd) {
  return tmpCwd.children.has(name);
}

export function checkIfDirectoryExists(directoryName, tmpCwd) {
  return tmpCwd.children.has(directoryName) && isDirectory(directoryName, tmpCwd);
}

export function getDirectory(directoryName, tmpCwd) {
  return tmpCwd.children.get(directoryName);
}

export function isDirectoryEmpty(directory) {
  return directory.children.size < 1;
}

export function isFile(fileName, tmpCwd) {
  return tmpCwd.children.get(fileName).type === "file";
}

export function checkIfFileExists(fileName, tmpCwd) {
  return tmpCwd.children.has(fileName) && isFile(fileName, tmpCwd);
}

export function getFile(fileName, tmpCwd) {
  return tmpCwd.children.get(fileName);
}

export function isDirectoryNameValid(name) {
  const regexPattern = "^[a-zA-Z]+[a-zA-Z0-9_-]*$";
  const regex = new RegExp(regexPattern);

  if(!regex.test(name)) {
    return false;
  }

  return true;
}

export function isFileNameValid(name) {
  const regexPattern = "^[a-zA-Z]+[a-zA-Z0-9_-]*\\.{1}[a-zA-Z0-9]+$";
  const regex = new RegExp(regexPattern);

  if(!regex.test(name)) {
    return false;
  }

  return true;
}

export function splitPathAndName(path) {
  // TODO:
  // better solution
  if(path === undefined) {
    return { name: "", pathTo: "" };
  }

  let splitPath = path.split("/");
  let name = splitPath.pop();
  let pathTo = splitPath.join("/");

  return { name, pathTo };
}

export function checkValidFlags(command, flags) {
  let validFlags = Object.keys(commands[command]["flags"]);

  for(let flag of flags) {
    if(!validFlags.includes(flag)) {
      throw new FlagError(
        `Invalid flag '${flag}'`,
        FLAG_NOT_FOUND
      )
    }
  }

  return FLAGS_PARSED_SUCCESSFULLY;
}

export function createHelpObject(command) {
  let result = {};
  let commandHelpObject = commands[command];
  let flagsArray = [];

  for(let flag of Object.values(commandHelpObject["flags"])) {
    flagsArray.push(flag);
  } 

  result = {
    command: command,
    type: "help",
    data: {
      description: commandHelpObject["description"],
      usage: commandHelpObject["usage"],
      flags: flagsArray
    }
  };

  return result;
}

export function createResultObject(command, type, data, code) {
  return {
    command: command,
    type: type,
    data: data,
    code: code
  };
}

export function createErrorObject(command, type, error) {
  return {
    command: command,
    type: type,
    data: {
      message: error.message,
      code: error.code
    }
  };
}