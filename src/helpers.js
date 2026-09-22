"use strict";

import { cwd, ROOT } from "./fileState.js";
import { commands } from "./commands.js";
import { FlagError, FLAG_NOT_FOUND, FLAGS_PARSED_SUCCESSFULLY } from "./constructors/Error.js";

export function isRootDirectory() {
  return cwd === ROOT;
}

export function isNameUndefinedOrEmpty(name) {
  return name === undefined || name.trim() === "";
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

export function getDirectory(directoryName) {
  return cwd.children.get(directoryName);
}

export function isDirectoryEmpty(directory) {
  return directory.children.size < 1;
}

export function isFile(fileName) {
  return cwd.children.get(fileName).type === "file";
}

export function checkIfFileExists(fileName) {
  return cwd.children.has(fileName) && isFile(fileName);
}

export function getFile(fileName) {
  return cwd.children.get(fileName);
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
    flagsArray.push();
  } 

  result = {
    command: command,
    type: "help",
    data: {
      description: commandHelpObject["description"],
      usage: commandHelpObject["usage"],
      flags: flagsArray
    }
  }

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