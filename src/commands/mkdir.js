"use strict";

import { cwd } from "../fileState.js";
import { Directory } from "../constructors/Directory.js";
import { checkIfDirectoryOrFileExists } from "../helpers.js";
import { 
  DirectorySystemError,
  DIRECTORY_ALREADY_EXISTS, 
  DIRECTORY_CREATED_SUCCESSFULLY
} from "../constructors/Error.js";

export function mkdir(directoryName) {
  // TODO:
  // throw an error
  if(checkIfDirectoryOrFileExists(directoryName)) {
    throw new DirectorySystemError(
      "Directory already exists!",
      DIRECTORY_ALREADY_EXISTS
    )
  }

  let newDirectory = new Directory(directoryName, cwd);
  cwd.children.set(directoryName, newDirectory);
  // console.log(`Directory '${directoryName}' created!`);
  cwd.lastModified = Date.now();

  return DIRECTORY_CREATED_SUCCESSFULLY;
}