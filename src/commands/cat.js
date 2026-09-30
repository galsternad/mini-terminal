"use strict";

import { getFile, splitPathAndName, isNameUndefinedOrEmpty, checkIfFileExists } from "../helpers.js";
import { FileSystemError } from "../constructors/Error.js";
import { FILE_NOT_FOUND, FILE_INVALID_NAME } from "../processCodes.js";
import { resolvePath } from "../pathResolver.js";

export function cat(path, flags) {
  let { name: fileName, pathTo } = splitPathAndName(path);
  
  const invalidNameString = `Invalid name: '${fileName}'.`;
  
  if(isNameUndefinedOrEmpty(fileName)) {
    throw new FileSystemError(
      invalidNameString,
      FILE_INVALID_NAME
    );
  }

  let tmpCwd = resolvePath(pathTo);
  
  const fileNotFoundString = `File '${fileName}' not found.`;  

  if(!checkIfFileExists(fileName, tmpCwd)) {
    throw new FileSystemError(
      fileNotFoundString,
      FILE_NOT_FOUND
    );
  }

  let file = getFile(fileName, tmpCwd);
  let result = file.content;

  if(flags.has("s")) {
    result = result
      .split("\n")
      .filter(item => {
        return item.trim() !== "";
      })
      .join("\n");
  }

  if(flags.has("b")) {
    let index = 1;

    result = result
      .split("\n")
      .map((item) => {
        if(item.trim() !== "") {
          return `${index++}: ${item}`;
        }
      })
      .join("\n");
  } else if(flags.has("n")) {
    result = result
      .split("\n")
      .map((item, index) => {
        return `${index + 1}: ${item}`;
      })
      .join("\n");
  } 
  
  return result;
}