"use strict";

import { getFile } from "../helpers.js";

export function cat(fileName) {
  let file = getFile(fileName);
  const fileNotFound = `File '${fileName}' not found!`;

  if(file === null) {
    return fileNotFound;
  }

  let result  = file.content;
  
  return result;
}