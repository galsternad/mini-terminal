"use strict";

import { Directory } from "../constructors/Directory.js";
import {
  checkIfDirectoryOrFileExists,
  isDirectoryNameValid,
  isNameUndefinedOrEmpty,
  splitPathAndName
} from "../helpers.js";
import { DirectorySystemError } from "../constructors/Error.js";
import {
  DIRECTORY_ALREADY_EXISTS, 
  DIRECTORY_CREATED_SUCCESSFULLY,
  DIRECTORY_INVALID_NAME
} from "../processCodes.js";
import { resolvePath } from "../pathResolver.js";

export function mkdir(path) {
  let { name: directoryName, pathTo } = splitPathAndName(path);

  const invalidNameString = `Invalid name: '${directoryName}'.`;
  const directoryOrFileAlreadyExistsString = `Directory or file '${directoryName}' already exists.`; 

  if(isNameUndefinedOrEmpty(directoryName) || !isDirectoryNameValid(directoryName)) {
    throw new DirectorySystemError(
      invalidNameString,
      DIRECTORY_INVALID_NAME
    );
  }

  let tmpCwd = resolvePath(pathTo);

  if(checkIfDirectoryOrFileExists(directoryName, tmpCwd)) {
    throw new DirectorySystemError(
      directoryOrFileAlreadyExistsString,
      DIRECTORY_ALREADY_EXISTS
    );
  }

  let newDirectory = new Directory(directoryName, tmpCwd);
  newDirectory.size += directoryName.length;
  tmpCwd.children.set(directoryName, newDirectory);
  tmpCwd.lastModified = Date.now();

  return DIRECTORY_CREATED_SUCCESSFULLY;
}