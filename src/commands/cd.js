"use strict";

import { DirectorySystemError } from "../constructors/Error.js";
import {
  DIRECTORY_NOT_FOUND,
  PROCESS_ERROR,
  PROCESS_EXECUTED_SUCCESSFULLY,
  DIRECTORY_INVALID_NAME
} from "../processCodes.js";
import { cwd, setCwd } from "../fileState.js";
import {
  isRootDirectory,
  getDirectory,
  checkIfDirectoryExists,
  isNameUndefinedOrEmpty
} from "../helpers.js";
import { resolvePath } from "../pathResolver.js";

export function cd(path) {
  const invalidNameString = `Invalid name: '${path}'.`;
  const directoryNotFoundString = `Directory '${path}' does not exist.`;

  if(isNameUndefinedOrEmpty(path)) {
    throw new DirectorySystemError(
      invalidNameString,
      DIRECTORY_INVALID_NAME
    );
  }

  let tmpCwd = resolvePath(path);

  setCwd(tmpCwd);

  return PROCESS_EXECUTED_SUCCESSFULLY;
}