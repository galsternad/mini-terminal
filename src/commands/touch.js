"use strict";

import { cwd } from "../fileState.js";
import { File } from "../constructors/File.js";
import {
  checkIfDirectoryOrFileExists, 
  isNameUndefinedOrEmpty,
  splitPathAndName
} from "../helpers.js";
import {
  FILE_ALREADY_EXISTS,
  FILE_CREATED_SUCCESSFULLY,
  FILE_INVALID_NAME
} from "../processCodes.js";
import { FileSystemError } from "../constructors/Error.js";
import { resolvePath } from "../pathResolver.js";

export function touch(path) {
  let { name: fileName, pathTo } = splitPathAndName(path);

  const invalidNameString = `Invalid name: '${fileName}'.`;
  const directoryOrFileAlreadyExistsString = `Directory or file '${fileName}' already exists.`; 

  if(isNameUndefinedOrEmpty(fileName)) {
    throw new FileSystemError(
      invalidNameString,
      FILE_INVALID_NAME
    );
  }

  let tmpCwd = resolvePath(pathTo);

  if(checkIfDirectoryOrFileExists(fileName, tmpCwd)) {
    throw new FileSystemError(
      directoryOrFileAlreadyExistsString,
      FILE_ALREADY_EXISTS
    );
  }

  let newFile = new File(fileName, tmpCwd);
  tmpCwd.children.set(fileName, newFile);
  tmpCwd.lastModified = Date.now();

  return FILE_CREATED_SUCCESSFULLY;
}