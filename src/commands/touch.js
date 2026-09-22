"use strict";

import { cwd } from "../fileState.js";
import { File } from "../constructors/File.js";
import { checkIfDirectoryOrFileExists, isNameUndefinedOrEmpty } from "../helpers.js";
import { FILE_ALREADY_EXISTS, FILE_CREATED_SUCCESSFULLY, FileSystemError } from "../constructors/Error.js";

export function touch(fileName) {
  const invalidNameString = `Invalid name: '${fileName}'.`;
  const directoryOrFileAlreadyExistsString = `Directory or file '${fileName}' already exists.`; 

  if(isNameUndefinedOrEmpty(fileName)) {
    throw new DirectorySystemError(
      invalidNameString,
      DIRECTORY_INVALID_NAME
    );
  }

  if(checkIfDirectoryOrFileExists(fileName)) {
    throw new FileSystemError(
      directoryOrFileAlreadyExistsString,
      FILE_ALREADY_EXISTS
    );
  }

  let newFile = new File(fileName, cwd);
  cwd.children.set(fileName, newFile);
  cwd.lastModified = Date.now();

  return FILE_CREATED_SUCCESSFULLY;
}