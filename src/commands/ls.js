"use strict";
import { cwd } from "../fileState.js";

export function ls() {
  let result = [];

  for(let child of cwd.children.values()) {
    let name = child.name;

    if(child.type === "directory") {
      name += "/";
    }

    result.push(name);
  }

  return result
    .sort()
    .join("\n")
}