"use strict";

import { getFile } from "../helpers.js";
import { FileSystemError } from "../constructors/Error.js";
import { FILE_NOT_FOUND } from "../processCodes.js";

export function cat(fileName, flags) {
  let file = getFile(fileName);
  
  if(file === null) {
    const fileNotFound = `File '${fileName}' not found!`;
    
    throw new FileSystemError(
      fileNotFound,
      FILE_NOT_FOUND
    );
  }

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