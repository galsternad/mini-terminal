"use strict";

import { DirectorySystemError } from "../constructors/Error.js";
import { 
  DIRECTORY_INVALID_NAME,
  DIRECTORY_NOT_EMPTY,
  DIRECTORY_NOT_FOUND,
  DIRECTORY_REMOVED_SUCCESSFULLY
} from "../processCodes.js";
import { cwd } from "../fileState.js";
import { 
  checkIfDirectoryExists,
  getDirectory,
  isDirectoryEmpty,
  isNameUndefinedOrEmpty,
  splitPathAndName
} from "../helpers.js";
import { resolvePath } from "../pathResolver.js";

export function rmdir(path, flags) {
  let { name: directoryName, pathTo } = splitPathAndName(path);

  const invalidNameString = `Invalid name: '${directoryName}'.`;
  const directoryNotFoundString = `Directory '${directoryName}' not found.`;
  const directoryNotEmptyString = `Cannot delete a non-empty directory '${directoryName}'.`;

  if(isNameUndefinedOrEmpty(directoryName)) {
    throw new DirectorySystemError(
      invalidNameString,
      DIRECTORY_INVALID_NAME
    );
  }

  let tmpCwd = resolvePath(pathTo);

  if(!checkIfDirectoryExists(directoryName, tmpCwd)) {
    throw new DirectorySystemError(
      directoryNotFoundString,
      DIRECTORY_NOT_FOUND
    );
  }

  let directory = getDirectory(directoryName, tmpCwd);

  if(!isDirectoryEmpty(directory)) {
    throw new DirectorySystemError(
      directoryNotEmptyString,
      DIRECTORY_NOT_EMPTY
    )
  }
  
  tmpCwd.children.delete(directoryName);
  tmpCwd.lastModified = Date.now();
  tmpCwd.parent.size -= tmpCwd.size;
  tmpCwd.parent.lastModified = Date.now();

  return DIRECTORY_REMOVED_SUCCESSFULLY;
}