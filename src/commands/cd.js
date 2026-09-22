"use strict";

import { DIRECTORY_NOT_FOUND, DirectorySystemError, PROCESS_ERROR, PROCESS_EXECUTED_SUCCESSFULLY } from "../constructors/Error.js";
import { cwd, setCwd } from "../fileState.js";
import { isRootDirectory, getDirectory, checkIfDirectoryExists } from "../helpers.js";

export function cd(directoryName) {
  const invalidNameString = `Invalid name: '${directoryName}'.`;
  const directoryNotFoundString = `Directory '${directoryName}' does not exist.`;

  if(isNameUndefinedOrEmpty(directoryName)) {
    throw new DirectorySystemError(
      invalidNameString,
      DIRECTORY_INVALID_NAME
    );
  }
  
  if(directoryName === ".." && isRootDirectory()) {
    throw new DirectorySystemError(
      "",
      PROCESS_ERROR
    );
  }

  if(directoryName === ".." && cwd.parent !== null) {
    return PROCESS_EXECUTED_SUCCESSFULLY;
  }

  if(!checkIfDirectoryExists(directoryName)) {
    throw new DirectorySystemError(
      directoryNotFoundString,
      DIRECTORY_NOT_FOUND
    );
  }

  let tmpCwd = getDirectory(directoryName);

  setCwd(tmpCwd);

  return PROCESS_EXECUTED_SUCCESSFULLY;
}