"use strict";

import { DirectorySystemError } from "../constructors/Error.js";
import { 
  DIRECTORY_INVALID_NAME,
  DIRECTORY_NOT_EMPTY,
  DIRECTORY_NOT_FOUND,
  DIRECTORY_REMOVED_SUCCESSFULLY,
} from "../processCodes.js";
import { cwd } from "../fileState.js";
import { 
  checkIfDirectoryExists,
  getDirectory,
  isDirectoryEmpty,
  isNameUndefinedOrEmpty
} from "../helpers.js";

export function rmdir(directoryName) {
  const invalidNameString = `Invalid name: '${directoryName}'.`;
  const directoryNotFoundString = `Directory '${directoryName}' does not exist.`;
  const directoryNotEmptyString = `Cannot delete a non-empty directory '${directoryName}'.`;

  if(isNameUndefinedOrEmpty(directoryName)) {
    throw new DirectorySystemError(
      invalidNameString,
      DIRECTORY_INVALID_NAME
    );
  }

  if(!checkIfDirectoryExists(directoryName)) {
    throw new DirectorySystemError(
      directoryNotFoundString,
      DIRECTORY_NOT_FOUND
    );
  }

  let directory = getDirectory(directoryName);

  if(!isDirectoryEmpty(directory)) {
    throw new DirectorySystemError(
      directoryNotEmptyString,
      DIRECTORY_NOT_EMPTY
    )
  }

  cwd.children.delete(directoryName);
  console.log(`'${directoryName}' successfully deleted!`);
  cwd.lastModified = Date.now();

  return DIRECTORY_REMOVED_SUCCESSFULLY;
}