"use strict";

import { cwd, setCwd } from "../fileState.js";
import { isRootDirectory, getDirectory } from "../helpers.js";

export function cd(directoryName) {
  if(directoryName === ".." && isRootDirectory()) {
    console.log("Cannot 'cd' while in root!");

    return [false, directoryName];
  }

  if(directoryName === ".." && cwd.parent !== null) {
    setCwd(cwd.parent);
    console.log(`'cd' to ${cwd.name} successful!`);

    return [true, cwd.name];
  }

  let tmpCwd = getDirectory(directoryName);
  
  if(tmpCwd === null) {
    return [false, directoryName];
  }

  setCwd(tmpCwd);
  console.log(`'cd' to ${cwd.name} successful!`);

  return [true, tmpCwd.name];
}