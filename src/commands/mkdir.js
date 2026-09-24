"use strict";

import { cwd } from "../fileState.js";
import { Directory } from "../constructors/Directory.js";
import { checkIfDirectoryOrFileExists, isNameUndefinedOrEmpty } from "../helpers.js";
import { DirectorySystemError } from "../constructors/Error.js";
import {
  DIRECTORY_ALREADY_EXISTS, 
  DIRECTORY_CREATED_SUCCESSFULLY,
  DIRECTORY_INVALID_NAME
} from "../processCodes.js"

export function mkdir(directoryName) {
  const invalidNameString = `Invalid name: '${directoryName}'.`;
  const directoryOrFileAlreadyExistsString = `Directory or file '${directoryName}' already exists.`; 

  if(isNameUndefinedOrEmpty(directoryName)) {
    throw new DirectorySystemError(
      invalidNameString,
      DIRECTORY_INVALID_NAME
    )
  }

  if(checkIfDirectoryOrFileExists(directoryName)) {
    throw new DirectorySystemError(
      directoryOrFileAlreadyExistsString,
      DIRECTORY_ALREADY_EXISTS
    );
  }

  let newDirectory = new Directory(directoryName, cwd);
  cwd.children.set(directoryName, newDirectory);
  cwd.lastModified = Date.now();

  return DIRECTORY_CREATED_SUCCESSFULLY;
}