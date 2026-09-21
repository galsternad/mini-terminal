"use strict";

import { ArgumentHistory } from "./constructors/ArgumentHistory.js";
import { mkdir } from "./commands/mkdir.js";
import { rmdir } from "./commands/rmdir.js";
import { touch } from "./commands/touch.js";
import { rm } from "./commands/rm.js";
import { ls } from "./commands/ls.js";
import { pwd } from "./commands/pwd.js";
import { cat } from "./commands/cat.js";
import { wc } from "./commands/wc.js";
import { write } from "./commands/write.js";
import { cd } from "./commands/cd.js";
import { tree } from "./commands/tree.js";
import { find } from "./commands/find.js";

const EXACT_NUMBER_OF_OPTIONS = "Command has to have an exact number of options!";
export let argumentHistory = new ArgumentHistory();

function exactNumberOfOptions(options, numberOfArguments) {
  return options.length === numberOfArguments;
}

function mkdirParse(options) {
  const numOfOptions = 1;
  
  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }
  
  let newDirectoryName = options[0];
  let result = mkdir(newDirectoryName);

  const couldNotCreateDirectory = `Could not create directory '${newDirectoryName}'!`;
  const directoryCreatedSuccesfully = `Directory '${newDirectoryName}' created!`;

  if(!result) {  
    return couldNotCreateDirectory;
  }

  return directoryCreatedSuccesfully;
}

function rmdirParse(options) {
  const numOfOptions = 1;
  
  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }
  
  let directoryName = options[0];
  let result = rmdir(directoryName);

  const couldNotRemoveDirectory = `Could not remove directory '${directoryName}'!`;
  const directoryRemovedSuccesfully = `Directory '${directoryName}' successfully removed!`;

  if(!result) {
    return couldNotRemoveDirectory;
  }

  return directoryRemovedSuccesfully;
}

function touchParse(options) {
  const numOfOptions = 1;

  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }

  let newFileName = options[0];
  let result = touch(newFileName);
  const couldNotCreateFile = `Could not create file '${newFileName}'!`;
  const fileCreatedSuccesfully = `File '${newFileName}' created!`;

  if(!result) {
    return couldNotCreateFile;
  }

  return fileCreatedSuccesfully;
}

function rmParse(options) {
  const numOfOptions = 1;

  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }

  let fileName = options[0];
  let result = rm(fileName);

  const couldNotRemoveFile = `Could not remove file '${fileName}'!`;
  const fileRemovedSuccesfully = `File '${fileName}' removed succesfully!`;

  if(!result) {
    return couldNotRemoveFile;
  }

  return fileRemovedSuccesfully;
}

function lsParse(options) {
  const numOfOptions = 0;
  
  if(!exactNumberOfOptions(options, numOfOptions)) {
    return "";
  }
  
  return ls();
}

function pwdParse(options) {
  const numOfOptions = 0;
  
  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }
  
  let result = pwd();
  
  return result;
}

function catParse(options) {
  const numOfOptions = 1;
  
  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }
  
  let fileName = options[0];
  let result = cat(fileName);
  
  return result;
}

function wcParse(options) {
  const numOfOptions = 1;
  
  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }
  
  let fileName = options[0];
  let result = wc(fileName);
  
  return result;
}

function writeParse(options) {
  const numOfOptions = 2;

  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }

  let fileName = options[0];
  let content = options[1];

  let result = write(fileName, content);

  const couldNotWriteToFile = `Could not write to file '${fileName}'!`;
  const writeToFileSuccesfully = `Write to '${fileName}' successful!\nWritten ${content.length} characters.`;

  if(!result) {
    return couldNotWriteToFile;
  }

  return writeToFileSuccesfully;
}

function cdParse(options) {
  const numOfOptions = 1;
  
  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }

  let newDirectoryArg = options[0];
  let [result, newDirectoryName] = cd(newDirectoryArg);

  const cdUnsuccessful = `Could not 'cd' to '${newDirectoryName}'!`;
  const cdSuccessful = `'cd' to '${newDirectoryName}' successful!`;

  if(!result) {
    return cdUnsuccessful;
  }

  return cdSuccessful;
}

function treeParse(options) {
  const numOfOptions = 0;

  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }

  let result = tree();

  return result;
}

function findParse(options) {
  const numOfOptions = 1;

  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }

  let fileName = options[0];
  let result = find(fileName);

  return result;
}

function isArgumentsStringEmpty(args) {
  return args.trim().length === 0;
}

function parseArguments(args) {
  // args.trim() + " "
  // so the last char will always be a 
  // space (last whitespace is always trimmed) 
  // with which I can then
  // push the last token to the array  
  let argsArray = args.trim() + " ";
  let isQuote = false;
  let quoteUsed = "";
  let isFlag = false;
  let flags = new Set();
  let tokenStarted = false;
  let token = "";
  let tokens = [];
  let lastChar = "";

  for(let char of argsArray) {
    if((char === "\"" || char === "\'") && !isQuote) {
      isQuote = true;
      quoteUsed = char;
      continue;
    }

    if(isQuote && quoteUsed === char) {
      isQuote = false;
      quoteUsed = "";
      continue;
    }

    if(char === "-" && !isQuote && token.length === 0) {
      isFlag = !isFlag;
      continue;
    }

    if(char !== " " && isFlag && tokens.length === 1) {
      token += char;
      continue;
    }

    if(char === " " && isFlag && tokens.length === 1) {
      isFlag = !isFlag;
      
      for(let flag of token) {
        if(!flags.has(flag)) {
          flags.add(flag);
        }
      }

      token = "";
      lastChar = char;
      continue;
    }
    
    if(char === " "  && !isQuote && !isFlag) {
      if(char !== lastChar) {
        tokens.push(token);
        token = "";
      }
    } else {
      token += char;
    }

    lastChar = char;
  }

  if(isQuote) {
    // TODO:
    // throw an error
    console.log("token error");
  }

  let command = tokens[0];
  let options = tokens.slice(1);

  console.log([command, flags, options]);

  return [command, flags, options];
}

export function parse(args) {
  const cannotParseEmptyString = "Cannot parse an empty string!";

  if(isArgumentsStringEmpty(args)) {
    return cannotParseEmptyString;
  }

  let [command, flags, options] = parseArguments(args);
  let result = "";

  argumentHistory.push(args);
  argumentHistory.index = argumentHistory.length;

  const invalidCommand = `Invalid command '${command}'.`;

  switch(command) {
    case "mkdir":
      result = mkdirParse(options);
      break;
    case "rmdir":
      result = rmdirParse(options);
      break;
    case "touch":
      result = touchParse(options);
      break;
    case "rm":
      result = rmParse(options);
      break;
    case "ls":
      result = lsParse(options);
      break;
    case "cd":
      result = cdParse(options);
      break;
    case "pwd":
      result = pwdParse(options);
      break;
    case "write":
      result = writeParse(options);
      break;
    case "cat":
      result = catParse(options);
      break;
    case "wc":
      result = wcParse(options);
      break;
    case "find":
      result = findParse(options);
      break;
    case "tree":
      result = treeParse(options);
      break;
    default:
      result = invalidCommand;
      break;
  }

  return result;
}

touch("file1.js");
touch("file2.js");
touch("my-file.txt");
touch("my-file.json");
touch("file3.js");
touch("app.cpp");
touch("app.exe");
mkdir("Documents");
mkdir("Downloads");
mkdir("Pictures");
mkdir("Videos");
cd("Documents");
mkdir("Projects");
mkdir("Faks");
touch("pic.jpg");
touch("pic2.jpg");
touch("pic3.jpg");
touch("pic4.png");
cd("Projects");
mkdir("mini-terminal");
cd("mini-terminal");
mkdir("src");
touch("README.md");
cd("src");
mkdir("commands");
mkdir("constructors");
cd("commands");
touch("cat.js");
touch("cd.js");
touch("find.js");
touch("ls.js");
touch("mkdir.js");
touch("pwd.js");
touch("rm.js");
touch("rmdir.js");
touch("touch.js");
touch("tree.js");
touch("wc.js");
touch("write.js");
cd("..");
cd("constructors");
touch("ArgumentHistory.js");
touch("Directory.js");
touch("File.js");
cd("..");
cd("..");
cd("..");
cd("..");
cd("..");