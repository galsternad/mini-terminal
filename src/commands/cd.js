"use strict";

import {
  PROCESS_EXECUTED_SUCCESSFULLY,
} from "../processCodes.js";
import { cwd, ROOT, setCwd } from "../fileState.js";
import {
  isNameUndefinedOrEmpty
} from "../helpers.js";
import { resolvePath } from "../pathResolver.js";

export function cd(path) {
  // if path is not defined or given, change directory to root
  if(isNameUndefinedOrEmpty(path)) {
    setCwd(ROOT);
  } else {
    let tmpCwd = resolvePath(path);
    setCwd(tmpCwd);
  }

  return PROCESS_EXECUTED_SUCCESSFULLY;
}