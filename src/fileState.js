"use strict";

import { Directory } from "./constructors/Directory.js";

export const ROOT = new Directory("/");
export let cwd = ROOT;

export function setCwd(newCwd) {
  cwd = newCwd;
}