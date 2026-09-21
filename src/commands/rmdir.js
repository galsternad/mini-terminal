"use strict";

import { cwd } from "../fileState.js";
import { canRemoveDirectory } from "../helpers.js";

export function rmdir(directoryName) {
  if(!canRemoveDirectory(directoryName)) {
    return false;
  }

  cwd.children.delete(directoryName);
  console.log(`'${directoryName}' successfully deleted!`);
  cwd.lastModified = Date.now();

  return true;
}