"use strict";

import { cwd } from "../fileState.js";
import { canRemoveFile } from "../helpers.js";

export function rm(fileName) {
  if(!canRemoveFile(fileName)) {
    return false;
  }

  cwd.children.delete(fileName);
  console.log(`'${fileName}' successfully deleted!`);
  cwd.lastModified = Date.now();

  return true;
}