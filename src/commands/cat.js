"use strict";

import { getFile } from "../helpers.js";
import { commands, getHelpString } from "../commands.js";

let catCommand = commands["cat"]

export function cat(fileName, flags) {
  let file = getFile(fileName);
  const fileNotFound = `File '${fileName}' not found!`;

  if(flags.has("h")) {
    let helpString = getHelpString(catCommand);

    return helpString;
  }
  
  if(file === null) {
    return fileNotFound;
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