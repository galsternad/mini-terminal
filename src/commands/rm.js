"use strict";

import { FileSystemError } from "../constructors/Error.js";
import { 
  FILE_REMOVED_SUCCESSFULLY,
  FILE_INVALID_NAME,
  FILE_NOT_FOUND
} from "../processCodes.js";
import { cwd } from "../fileState.js";
import {
  checkIfFileExists,
  isNameUndefinedOrEmpty,
  getFile,
  splitPathAndName
} from "../helpers.js";
import { resolvePath } from "../pathResolver.js";

export function rm(path) {
  let { name: fileName, pathTo } = splitPathAndName(path);
  const invalidNameString = `Invalid name: '${fileName}'.`;
  const fileNotFoundString = `File '${fileName}' does not exist.`;

  if(isNameUndefinedOrEmpty(fileName)) {
    throw new FileSystemError(
      invalidNameString,
      FILE_INVALID_NAME
    );
  }

  let tmpCwd = resolvePath(pathTo);

  if(!checkIfFileExists(fileName, tmpCwd)) {
    throw new FileSystemError(
      fileNotFoundString,
      FILE_NOT_FOUND
    );
  }

  tmpCwd.children.delete(fileName);
  tmpCwd.lastModified = Date.now();

  return FILE_REMOVED_SUCCESSFULLY;
}