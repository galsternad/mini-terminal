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
import { commands } from "./commands.js";
import { createResultObject, getHelpString } from "./helpers.js";

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

  return {
    command: "mkdir",
    type: "text",
    value: directoryCreatedSuccesfully
  };
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

  return {
    command: "rmdir",
    type: "text",
    value: directoryRemovedSuccesfully
  };
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

  return {
    command: "touch",
    type: "text",
    value: fileCreatedSuccesfully
  };
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
    return {
      command: "rm",
      value: couldNotRemoveFile
    };
  }

  return {
    command: "rm",
    type: "text",
    value: fileRemovedSuccesfully
  };
}

function lsParse(options, flags) {
  let result = {};

  if(flags.has("h")) {
    let helpString = getHelpString(commands["ls"]);

    result = createResultObject("ls", "text", helpString);

    return result;
  }

  let data = ls();

  result = createResultObject("ls", "entries", data);

  return result;
}

function pwdParse(options) {
  let result = {};
  
  let data = pwd();

  result = createResultObject("pwd", "text", data);

  return result;
}

function catParse(options, flags) {
  let result = {};

  if(flags.has("h")) {
    let helpString = getHelpString(commands["cat"]);

    result = createResultObject("cat", "text", helpString);

    return result;
  }

  let fileName = options[0];
  let data = cat(fileName, flags);
  
  result = createResultObject("cat", "text", data);

  return result;
}

function wcParse(options) {
  const numOfOptions = 1;
  
  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }
  
  let fileName = options[0];
  let result = wc(fileName);
  
  return {
    command: "wc",
    type: "text",
    value: result
  };
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

  return {
    command: "write",
    type: "text",
    value: writeToFileSuccesfully
  };
}

function cdParse(options, flags) {
  let result = {};

  if(flags.has("h")) {
    let helpString = getHelpString(commands["cd"]);

    result = createResultObject("cd", "text", helpString);

    return result;
  }

  let newDirectoryArg = options[0];
  let newDirectoryName = cd(newDirectoryArg);

  const cdUnsuccessful = `Could not 'cd' to '${newDirectoryName}'!`;
  const cdSuccessful = `'cd' to '${newDirectoryName}' successful!`;

  if(!result) {
    return "err";
  }

  return {
    command: "cd",
    type: "text",
    value: cdSuccessful
  };
}

function treeParse(options) {
  const numOfOptions = 0;

  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }

  let result = tree();

  return {
    command: "tree",
    type: "entries",
    value: result
  };
}

function findParse(options) {
  const numOfOptions = 1;

  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }

  let fileName = options[0];
  let result = find(fileName);

  return {
    command: "find",
    type: "entries",
    value: result
  };
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
    console.log("throw quote error");
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
      result = pwdParse(options, flags);
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
      result = treeParse(options, flags);
      break;
    default:
      result = invalidCommand;
      break;
  }

  console.log(result);

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
write("file1.js", "hello\n\n\n     \n    hello");
console.clear();