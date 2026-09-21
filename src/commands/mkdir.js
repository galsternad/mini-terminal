"use strict";

import { cwd } from "../fileState.js";
import { Directory } from "../constructors/Directory.js";
import { checkIfDirectoryOrFileExists } from "../helpers.js";

export function mkdir(directoryName) {
  if(checkIfDirectoryOrFileExists(directoryName)) {
    console.log(`'${directoryName}' already exists!`);

    return false;
  }

  let newDirectory = new Directory(directoryName, cwd);
  cwd.children.set(directoryName, newDirectory);
  console.log(`Directory '${directoryName}' created!`);
  cwd.lastModified = Date.now();

  return true;
}