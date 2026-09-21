"use strict";

import { cwd } from "../fileState.js";
import { File } from "../constructors/File.js";
import { checkIfDirectoryOrFileExists } from "../helpers.js";

export function touch(fileName) {
  if(checkIfDirectoryOrFileExists(fileName)) {
    console.log(`'${fileName}' already exists!`);

    return false;
  }

  let newFile = new File(fileName, cwd);
  cwd.children.set(fileName, newFile);
  console.log(`File '${fileName}' created!`);
  cwd.lastModified = Date.now();

  return true;
}