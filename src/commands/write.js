"use strict";

import { FileSystemError } from "../constructors/Error.js";
import { FILE_MODIFIED_SUCCESSFULLY, FILE_NOT_FOUND } from "../processCodes.js";
import { checkIfFileExists, isNameUndefinedOrEmpty, getFile, splitPathAndName } from "../helpers.js";
import { resolvePath } from "../pathResolver.js";

export function write(path, content) {
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

  let file = getFile(fileName, tmpCwd);

  if(file.content.length === 0) {
    file.content = content;
  } else {
    file.content += `\n${content}`
  }

  file.lastModified = Date.now();

  return FILE_MODIFIED_SUCCESSFULLY;
}