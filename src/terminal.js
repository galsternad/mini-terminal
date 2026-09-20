"use strict";

const ROOT = new Directory("/");
const EMPTY_STRING = "";
const EXACT_NUMBER_OF_OPTIONS = "Command has to have an exact number of options!";

let cwd = ROOT;

function Directory(
  name,
  parent = null,
  type = "directory",
  children = new Map(),
  createdAt = Date.now(),
  lastModified = Date.now()
) {
  this.name = name;
  this.parent = parent;
  this.type = type;
  this.children = children;
  this.createdAt = createdAt;
  this.lastModified = lastModified;
}

function File(
  name,
  parent,
  type = "file",
  content = EMPTY_STRING,
  createdAt = Date.now(),
  lastModified = Date.now()
) {
  this.name = name;
  this.parent = parent;
  this.type = type;
  this.content = content;
  this.createdAt = createdAt;
  this.lastModified = lastModified;
}

function isRootDirectory() {
  return cwd === ROOT;
}

function isDirectory(directoryName) {
  return cwd.children.get(directoryName).type === "directory";
}

function checkIfDirectoryOrFileExists(name) {
  return cwd.children.has(name);
}

function checkIfDirectoryExists(directoryName) {
  return cwd.children.has(directoryName) && isDirectory(directoryName);
}

function isFile(fileName) {
  return cwd.children.get(fileName).type === "file";
}

function checkIfFileExists(fileName) {
  return cwd.children.has(fileName) && isFile(fileName);
}

function getDirectory(directoryName) {
  if(!checkIfDirectoryExists(directoryName)) {
    return null;
  }

  return cwd.children.get(directoryName);
}

function canRemoveDirectory(directoryName) {
  let directory = getDirectory(directoryName);

  if(directory === null) {
    return false;
  }

  if(directory.children.size !== 0) {
    console.log(`Cannot delete a non-empty directory!`);
    
    return false;
  }

  return true;
}

function getFile(fileName) {
  if(!checkIfFileExists(fileName)) {
    return null;
  }

  return cwd.children.get(fileName)
}

function canRemoveFile(fileName) {
  let file = getFile(fileName);

  if(file === null) {
    return false;
  }

  return true;
}

function pwd() {
  if(cwd === ROOT) {
    return "/";
  }
  
  let currentWorkingDirectory = cwd;
  let currentWorkingDirectoryArr = [];
  currentWorkingDirectoryArr.push(cwd.name);

  while(currentWorkingDirectory.parent !== null) {
    currentWorkingDirectory = currentWorkingDirectory.parent;
    currentWorkingDirectoryArr.push(currentWorkingDirectory.name);
  }

  return currentWorkingDirectoryArr
    .reverse()
    .join("/")
    .slice(1);
}

// TODO: 
// return same type
function pwdParse(options) {
  const numOfOptions = 0;

  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }

  let result = pwd();

  return result;
}

function ls() {
  let result = [];

  for(let key of cwd.children.keys()) {
    result.push(key);
  }

  return result.join("\n");
}

function lsParse(options) {
  const numOfOptions = 0;
  
  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }

  return ls();
}

function mkdir(directoryName) {
  if(checkIfDirectoryOrFileExists(directoryName)) {
    console.log(`'${directoryName}' already exists!`);

    return false;
  }

  let newDirectory = new Directory(directoryName, cwd);
  cwd.children.set(directoryName, newDirectory);
  console.log(`Directory '${directoryName}' created!`);
  cwd.lastModified = Date.now();

  return true;
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

function rmdir(directoryName) {
  if(!canRemoveDirectory(directoryName)) {
    return false;
  }

  cwd.children.delete(directoryName);
  console.log(`'${directoryName}' successfully deleted!`);
  cwd.lastModified = Date.now();

  return true;
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

function touch(fileName) {
  if(checkIfDirectoryOrFileExists(fileName)) {
    console.log(`'${fileName}' already exists!`);

    return false;
  }

  let newFile = new File(fileName, cwd);
  cwd.children.set(fileName, newFile);
  console.log(`File '${fileName}' created!`);
  cwd.lastModified = Date.now();

  return true;
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

function rm(fileName) {
  if(!canRemoveFile(fileName)) {
    return false;
  }

  cwd.children.delete(fileName);
  console.log(`'${fileName}' successfully deleted!`);
  cwd.lastModified = Date.now();

  return true;
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

function cd(directoryName) {
  if(directoryName === ".." && isRootDirectory()) {
    console.log("Cannot 'cd' while in root!");

    return [false, directoryName];
  }

  if(directoryName === ".." && cwd.parent !== null) {
    cwd = cwd.parent;
    console.log(`'cd' to ${cwd.name} successful!`);

    return [true, cwd.name];
  }

  let tmpCwd = getDirectory(directoryName);
  
  if(tmpCwd === null) {
    return [false, directoryName];
  }

  cwd = tmpCwd;
  console.log(`'cd' to ${cwd.name} successful!`);

  return [true, tmpCwd.name];
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

function write(fileName, content) {
  let file = getFile(fileName);

  if(file === null) {
    return false;
  }

  let fileContent = file.content;

  if(fileContent.length === 0) {
    fileContent = content;
  } else {
    fileContent += `\n${content}`
  }

  file.lastModified = Date.now();

  return true;
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

function cat(fileName) {
  let file = getFile(fileName);
  const fileNotFound = `File '${fileName}' not found!`;

  if(file === null) {
    return fileNotFound;
  }

  let result  = file.content;
  
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

function countLines(str) {
  const empty = 0;

  if(str.trim() === EMPTY_STRING) {
    return empty;
  }

  let lines = 1

  for(let char of str) {
    if(char === "\n") {
      lines++;
    }
  }

  return lines;
}

function countWords(str) {
  const empty = 0;

  if(str.trim() === EMPTY_STRING) {
    return empty;
  }

  return str
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .length;
}

function wc(fileName) {
  let file = getFile(fileName);

  if(file === null) {
    return `'${fileName}' does not exist!`;
  }

  let fileContent = file.content;
  let characters = fileContent.length;
  let lines = countLines(fileContent);

  // clean up for the lines and words count
  fileContent = fileContent.replace(/\s+/g, " ").trim();
  let words = countWords(fileContent);

  let result = 
    `characters: ${characters}\n` +
    `words: ${words}\n` +
    `lines: ${lines}`;

  return result;
}

function wcParse(options) {
  const numOfOptions = 1;
  
  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }

  console.log(options);

  let fileName = options[0];
  let result = wc(fileName);

  return result;
}

function tree() {
  let directory = cwd;
  let directoryName = "";
  const depth = 0;

  let result = callTreeRecursive(directory, directoryName, depth);

  return result.slice(0, result.length - 1);
}

function buildTreeString(child, depth) {
  let result = EMPTY_STRING;
  const indent = 2;

  // indent
  for(let i = 0; i < depth * indent; i++) {
    result += " ";
  }

  result += child.name;

  if(child.type === "directory") {
    result += "/";
  }

  result += "\n";

  return result;
}

function callTreeRecursive(directory, str, depth) {
  for(let child of directory.children.values()) {
    str += buildTreeString(child, depth);
    
    if(child.type === "directory") {
      str = callTreeRecursive(child, str, depth + 1);
    }
  }

  return str;
}

function treeParse(options) {
  const numOfOptions = 0;

  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }

  let result = tree();

  return result;
}

function find(target) {
  let directory = cwd;
  let result = callFindRecursive(target, directory, EMPTY_STRING);

  if(result.length === 0) {
    return `Couldn't find '${target}'!`;
  }

  return `Found '${target}':\n` + result.slice(0, result.length - 1);
}

function buildFindString(child) {
  let currentWorkingDirectory = child.parent;
  let result = [];
  
  if(currentWorkingDirectory === ROOT) {
    return "/" + child.name + "\n";
  }
  
  result.push(currentWorkingDirectory.name);
  
  while(currentWorkingDirectory.parent != null) {
    currentWorkingDirectory = currentWorkingDirectory.parent;
    result.push(currentWorkingDirectory.name);
  }
  
  return result
    .reverse()
    .join("/")
    .slice(1) + "/" + child.name + "\n";
}

function callFindRecursive(target, directory, str) {
  for(let child of directory.children.values()) {
    if(child.name.includes(target)) {
      str += buildFindString(child);
    }
    
    if(child.type === "directory") {
      str = callFindRecursive(target, child, str);
    }
  }
  
  return str;
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
  let tokens = [];
  let flags = new Set();
  let token = "";
  let lastChar = "";

  for(let char of argsArray) {
    if(char === "\"" || char === "\'") {
      isQuote = !isQuote;
      quoteUsed = char;
      continue;
    }

    if(char === "-" && !isQuote && token.length === 0) {
      isFlag = !isFlag;
      continue;
    }

    if(char !== " " && isFlag) {
      token += char;
      continue;
    }

    if(char === " " && isFlag) {
      isFlag = !isFlag;
      
      for(let flag of token) {
        if(!flags.has(flag)) {
          flags.add(flag);
          console.log(flag);
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

function exactNumberOfOptions(options, numberOfArguments) {
  return options.length === numberOfArguments;
}

function parse(args) {
  const cannotParseEmptyString = "Cannot parse an empty string!";

  if(isArgumentsStringEmpty(args)) {
    return cannotParseEmptyString;
  }

  let argumentsArray = parseArguments(args);
  console.log(argumentsArray);
  let [command, flags, options] = parseArguments(args);
  let result = EMPTY_STRING;

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

function help(command) {

}

function save(options) {

}

function importJSON(options) {

}

function exportJSON(options) {

}

touch("app1.js");
touch("app2.js");
touch("app3.js");
mkdir("dir_1");
mkdir("dir_2");
mkdir("dir_3");
mkdir("dir_4");
mkdir("dir_5");
touch("app4.js");
cd("dir_1");
touch("file1.js");
touch("file2.js");
touch("file3.js");
mkdir("dir_dir_1");
mkdir("dir_dir_2");
cd("dir_dir_2");
touch("file1.js");
touch("file2.js");
cd("..");
cd("..");
cd("dir_1");

function createNewCliDiv() {
  let cliDiv = document.createElement("div");
  cliDiv.classList.add("cli-div");

  return cliDiv;
}

function createNewCliLabel() {
  let userCwdString = `user@${pwd()}:$ `;
  let cliLabel = document.createElement("label");
  cliLabel.classList.add("cli-label");
  cliLabel.textContent = userCwdString;

  return cliLabel;
}

function createNewCliInput() {
  let cliInput = document.createElement("input");
  cliInput.setAttribute("type", "text");
  cliInput.setAttribute("name", "cli-input");
  cliInput.setAttribute("autocomplete", "off");
  cliInput.classList.add("cli-input");
  setNewCliInput(cliInput);

  return cliInput;
}

function createNewCliResult(str) {
  let result = parse(str);

  let cliResult = document.createElement("pre");
  cliResult.classList.add("cli-result");
  cliResult.textContent = result;

  return cliResult;
}

function createNewCli() {
  let body = document.querySelector(".cli");
  body.innerHTML = "";
  
  let cliDiv = createNewCliDiv();
  let cliLabel = createNewCliLabel();
  let cliInput = createNewCliInput();

  cliDiv.appendChild(cliLabel);
  cliDiv.appendChild(cliInput);
  body.appendChild(cliDiv);

  cliInput.focus();
}

function addNewResult(input) {
  let newResult = createNewCliResult(input);
  let newCliDiv = createNewCliDiv();
  let newCliLabel = createNewCliLabel();
  let newCliInput = createNewCliInput();

  newCliDiv.appendChild(newCliLabel);
  newCliDiv.appendChild(newCliInput);
  document.querySelector(".cli").appendChild(newResult);
  document.querySelector(".cli").appendChild(newCliDiv);

  newCliInput.focus();
}

function clearCli() {
  createNewCli();
}

function setNewCliInput(input) {
  input.addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
      e.preventDefault();
      input.readOnly = true;

      let result = input.value.trim();

      if(result !== "clear") {
        addNewResult(result);
      } else {
        clearCli();
      }
    }
  });
}

createNewCli();