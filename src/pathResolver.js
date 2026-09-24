"use strict";

import { cwd } from "./fileState.js";
import { DirectorySystemError } from "./constructors/Error.js";
import { 
  NOT_A_DIRECTORY,
  DIRECTORY_NOT_FOUND
} from "./processCodes.js";

export function resolvePath(path) {
  let pathArray = path.split("/");
  let tmp = cwd;

  for(let pathElement of pathArray) {
    // it's the same directory
    if(pathElement === "." || pathElement === "") {
      continue;
    }

    if(pathElement === "..") {
      if(tmp.parent !== null) {
        tmp = tmp.parent;

        continue;
      } else {
        throw new DirectorySystemError(
          "Not found, parent is null.",
          DIRECTORY_NOT_FOUND
        )
      }
    }

    if(!tmp.children.has(pathElement)) {
      throw new DirectorySystemError(
        "Not found",
        DIRECTORY_NOT_FOUND
      )
    }

    tmp = tmp.children.get(pathElement);

    if(tmp.type !== "directory") {
      throw new DirectorySystemError(
        "Not a directory",
        NOT_A_DIRECTORY
      );
    }
  }

  return tmp;
}