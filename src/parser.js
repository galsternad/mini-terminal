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
import { date } from "./commands/date.js";
import { TokenizerError } from "./constructors/Error.js";
import { 
  createResultObject,
  checkValidFlags,
  createHelpObject
} from "./helpers.js";
import {
  PROCESS_EXECUTED_SUCCESSFULLY,
  INVALID_TOKEN
} from "./processCodes.js";
import { resolvePath } from "./pathResolver.js";

const EXACT_NUMBER_OF_OPTIONS = "Command has to have an exact number of options!";
export let argumentHistory = new ArgumentHistory();

function exactNumberOfOptions(options, numberOfArguments) {
  return options.length === numberOfArguments;
}

function mkdirParse(options, flags) {
  let result = {};

  checkValidFlags("mkdir", flags);
  
  if(flags.has("h")) {
    result = createHelpObject("mkdir");

    return result;
  } 

  let directoryName = options[0];
  let code = mkdir(directoryName);
  const directoryCreatedSuccesfully = `Directory '${directoryName}' created!`;

  result = createResultObject("mkdir", "text", directoryCreatedSuccesfully, code);

  return result;
}

function rmdirParse(options, flags) {
  let result = {};

  checkValidFlags("rmdir", flags);

  if(flags.has("h")) {
    result = createHelpObject("rmdir");

    return result;
  }

  let directoryName = options[0];
  let code  = rmdir(directoryName);
  const directoryRemovedSuccesfully = `Directory '${directoryName}' successfully removed!`;

  result = createResultObject("rmdir", "text", directoryRemovedSuccesfully, code);

  return result;
}

function touchParse(options, flags) {
  let result = {};

  checkValidFlags("touch", flags);

  if(flags.has("h")) {
    result = createHelpObject("touch");

    return result;
  }

  let fileName = options[0];
  let code = touch(fileName);
  const fileCreatedSuccesfully = `File '${fileName}' created!`;

  result = createResultObject("touch", "text", fileCreatedSuccesfully, code);

  return result;
}

function rmParse(options, flags) {
  let result = {};

  checkValidFlags("rm", flags);
  
  if(flags.has("h")) {
    result = createHelpObject("rm");

    return result;
  }
  
  let fileName = options[0];
  let code = rm(fileName);
  const fileRemovedSuccesfully = `File '${fileName}' removed succesfully!`;

  result = createResultObject("rm", "text", fileRemovedSuccesfully, code);

  return result;
}

function lsParse(options, flags) {
  let result = {};

  checkValidFlags("ls", flags);

  if(flags.has("h")) {
    result = createHelpObject("ls");

    return result;
  }

  let path = options[0];
  let data = ls(path, flags);

  result = createResultObject("ls", "entries", data, PROCESS_EXECUTED_SUCCESSFULLY);

  return result;
}

function pwdParse(flags) {
  let result = {};

  checkValidFlags("pwd", flags);
  
  let data = pwd();

  result = createResultObject("pwd", "text", data, PROCESS_EXECUTED_SUCCESSFULLY);

  return result;
}

function catParse(options, flags) {
  let result = {};

  checkValidFlags("cat", flags);

  if(flags.has("h")) {
    result = createHelpObject("cat");

    return result;
  }

  let fileName = options[0];
  let data = cat(fileName, flags);

  result = createResultObject("cat", "text", data, PROCESS_EXECUTED_SUCCESSFULLY);

  return result;
}

function wcParse(options, flags) {
  let result = {};

  checkValidFlags("wc", flags);

  if(flags.has("h")) {
    result = createHelpObject("wc");

    return result;
  }
  
  let fileName = options[0];
  let data = wc(fileName);
  
  result = createResultObject("wc", "text", data, PROCESS_EXECUTED_SUCCESSFULLY);
}

function writeParse(options, flags) {
  let result = {};

  checkValidFlags("write", flags);

  if(flags.has("h")) {
    result = createHelpObject("write");

    return result;
  }

  let fileName = options[0];
  let content = options[1];
  let code = write(fileName, content);
  const writeToFileSuccesfully = `Write to '${fileName}' successful!\nWritten ${content.length} characters.`;

  result = createResultObject("write", "text", writeToFileSuccesfully, code);
  
  return result;
}

function cdParse(options, flags) {
  let result = {};

  checkValidFlags("cd", flags);

  if(flags.has("h")) {
    result = createHelpObject("cd");

    return result;
  }

  let directoryName = options[0];
  let code = cd(directoryName);
  const cdSuccessful = `'cd' to '${directoryName}' successful!`;

  result = createResultObject("cd", "text", cdSuccessful, code);
}

function treeParse(flags) {
  let result = {};

  checkValidFlags("tree", flags);

  if(flags.has("h")) {
    result = createHelpObject("tree");

    return result;
  }

  let data = tree();

  result = createResultObject("tree", "entries", data, PROCESS_EXECUTED_SUCCESSFULLY);

  return result;
}

function findParse(options, flags) {
  let result = {};

  checkValidFlags("find", flags);

  if(flags.has("h")) {
    result = createHelpObject("find");

    return result;
  }

  let fileName = options[0];
  let data = find(fileName);

  result = createResultObject("find", "entries", data, PROCESS_EXECUTED_SUCCESSFULLY);

  return result;
}

function dateParse(options, flags) {
  let result = {};

  checkValidFlags("date", flags);

  if(flags.has("h")) {
    result = createHelpObject("date");

    return result;
  }

  let data = date();

  result = createResultObject("date", "text", data, PROCESS_EXECUTED_SUCCESSFULLY);

  return result;
}

function isArgumentsStringEmpty(args) {
  return args.trim().length === 0;
}

function tokenizer(args) {
  let argumentsArray = args.trim();
  let tokenStarted = false;
  let token = "";
  let tokens = [];
  let isQuote = false;
  let quoteUsed = "";
  let isFlag = false;
  let flags = new Set();
  let isEscaped = false;

  for(let char of argumentsArray) {
    if(isEscaped && tokenStarted) {
      switch(char){
        case "n":
          token += "\n";
          break;
        default:
          token += char;
          break;
      }

      isEscaped = false;
      continue;
    }

    if(char === "\\" && !isEscaped && tokenStarted) {
      isEscaped = true;
      continue;
    }

    if((char === "\"" || char === "\'") && !isQuote && !tokenStarted) {
      tokenStarted = true;
      isQuote = true;
      quoteUsed = char;
      continue;
    }

    if(char === quoteUsed && isQuote && tokenStarted) {
      isQuote = false;
      quoteUsed = "";
      continue;
    }

    // tokens.length === 1, because if length is 1,
    // that means that the command was already parsed
    // and we can only add flags between command and options
    if(char === "-" && !isQuote && !tokenStarted && tokens.length === 1) {
      isFlag = true;
      continue;
    }

    if(isFlag) {
      if(char !== " ") {
        flags.add(char);
      } else {
        isFlag = false;
      }

      continue;
    }

    if(char === " " && tokenStarted) {
      if(!isQuote) {
        tokens.push(token);
        tokenStarted = false;
        token = "";
      } else {
        token += char;
      }

      continue;
    }

    if(char === " " && !tokenStarted) {
      continue;
    }

    tokenStarted = true;
    token += char;
  }

  if(tokenStarted && !isQuote) {
    tokens.push(token);
    tokenStarted = false;
    token = "";
  }

  if(isQuote) {
    throw new TokenizerError(
      `Argument should be enclosed in quotes.`,
      INVALID_TOKEN
    )
  }

  let command = tokens[0];
  let options = tokens.slice(1);

  return { command, flags, options };
}

export function parse(args) {
  const cannotParseEmptyString = "Cannot parse an empty string!";

  if(isArgumentsStringEmpty(args)) {
    return cannotParseEmptyString;
  }

  let { command, flags, options } = tokenizer(args);

  let result = {};

  argumentHistory.push(args);
  argumentHistory.index = argumentHistory.length;

  const invalidCommand = `Invalid command '${command}'.`;

  try {
    switch(command) {
      case "mkdir":
        result = mkdirParse(options, flags);
        break;
      case "rmdir":
        result = rmdirParse(options, flags);
        break;
      case "touch":
        result = touchParse(options, flags);
        break;
      case "rm":
        result = rmParse(options, flags);
        break;
      case "ls":
        result = lsParse(options, flags);
        break;
      case "cd":
        result = cdParse(options, flags);
        break;
      case "pwd":
        result = pwdParse(flags);
        break;
      case "write":
        result = writeParse(options, flags);
        break;
      case "cat":
        result = catParse(options, flags);
        break;
      case "wc":
        result = wcParse(options, flags);
        break;
      case "find":
        result = findParse(options, flags);
        break;
      case "tree":
        result = treeParse(flags);
        break;
      case "date":
        result = dateParse(options, flags);
        break;
      default:
        result = invalidCommand;
        break;
    }
  } catch(err) {
    return {
      command: command,
      type: "error",
      entries: {
        message: err.message,
        code: err.code
      }
    };
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
cd("..");
cd("..");
cd("..");

console.clear();