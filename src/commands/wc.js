"use strict"

import { FileSystemError } from "../constructors/Error.js";
import { checkIfFileExists, getFile, isNameUndefinedOrEmpty, splitPathAndName } from "../helpers.js";
import { resolvePath } from "../pathResolver.js";
import { FILE_INVALID_NAME, FILE_NOT_FOUND } from "../processCodes.js";

function countLines(str) {
  const empty = 0;

  if(str.trim() === "") {
    return empty;
  }

  let lines = 1

  for(let char of str) {
    if(char === "\n") {
      lines++;
    }
  }

  return lines;
}

function countWords(str) {
  const empty = 0;

  if(str.trim() === "") {
    return empty;
  }

  return str
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .length;
}

export function wc(path, flags) {
  let { name: fileName, pathTo } = splitPathAndName(path);
  const invalidNameString = `Invalid name: '${fileName}'.`;
  const fileNotFoundString = `File '${fileName}' not found.`;

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
  let fileContent = file.content;
  let characters = fileContent.length;
  let lines = countLines(fileContent);

  // clean up for the lines and words count
  fileContent = fileContent.replace(/\s+/g, " ").trim();
  let words = countWords(fileContent);

  let result = 
    `characters: ${characters}\n` +
    `words: ${words}\n` +
    `lines: ${lines}`;

  return result;
}