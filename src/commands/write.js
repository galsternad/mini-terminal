"use strict";

import { FileSystemError } from "../constructors/Error.js";
import { FILE_MODIFIED_SUCCESSFULLY, FILE_NOT_FOUND } from "../processCodes.js";
import { checkIfFileExists, isNameUndefinedOrEmpty, getFile } from "../helpers.js";

export function write(fileName, content) {
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

  let file = getFile(fileName);

  if(file.content.length === 0) {
    file.content = content;
  } else {
    file.content += `\n${content}`
  }

  file.lastModified = Date.now();

  return FILE_MODIFIED_SUCCESSFULLY;
}