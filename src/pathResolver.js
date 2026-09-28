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

  const directoryNotFoundString = `Directory '${path}' does not exist.`;
  
  for(let pathElement of pathArray) {
    // it's the same directory
    if(pathElement === "." || pathElement === "") {
      continue;
    }
    
    if(pathElement === "..") {
      if(tmp.parent === null) {        
        throw new DirectorySystemError(
          directoryNotFoundString,
          DIRECTORY_NOT_FOUND
        );
        
      }
      tmp = tmp.parent;
      continue;
    }
    
    if(!tmp.children.has(pathElement)) {
      throw new DirectorySystemError(
        directoryNotFoundString,
        DIRECTORY_NOT_FOUND
      )
    }
    
    tmp = tmp.children.get(pathElement);

    const isNotADirectoryString = `'${tmp.name}' is not a directory.`;
    
    if(tmp.type !== "directory") {
      throw new DirectorySystemError(
        isNotADirectoryString,
        NOT_A_DIRECTORY
      );
    }
  }

  return tmp;
}