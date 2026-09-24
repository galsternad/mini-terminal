"use strict";

import { FileSystemError } from "../constructors/Error.js";
import { 
  FILE_REMOVED_SUCCESSFULLY,
  FILE_INVALID_NAME,
  FILE_NOT_FOUND,
} from "../processCodes.js";
import { cwd } from "../fileState.js";
import {
  checkIfFileExists,
  isNameUndefinedOrEmpty,
  getFile
} from "../helpers.js";

export function rm(fileName) {
  const invalidNameString = `Invalid name: '${fileName}'.`;
  const fileNotFoundString = `File '${fileName}' does not exist.`;

  if(isNameUndefinedOrEmpty(fileName)) {
    throw new FileSystemError(
      invalidNameString,
      FILE_INVALID_NAME
    );
  }

  if(!checkIfFileExists(fileName)) {
    throw new FileSystemError(
      fileNotFoundString,
      FILE_NOT_FOUND
    );
  }

  cwd.children.delete(fileName);
  cwd.lastModified = Date.now();

  return FILE_REMOVED_SUCCESSFULLY;
}