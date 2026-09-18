"use strict";

const ROOT = new Directory("/");
const EMPTY_STRING = "";
const EXACT_NUMBER_OF_OPTIONS = "Command has to have an exact number of options!";
const TOO_MANY_OPTIONS = "Too many options!";

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

  if(file.content.length === 0) {
    file.content = content;
  } else {
    file.content += `\n${content}`
  }

  file.lastModified = Date.now();

  return true;
}

function validQuotes(content) {
  return (content[0] === "\"" && content[content.length - 1] === "\"") ||
    (content[0] === "\'" && content[content.length - 1] === "\'");
}

function removeQuotes(content) {
  return content.slice(1, content.length - 1);
}

function writeParse(options) {
  const numOfOptions = 2;

  if(!exactNumberOfOptions(options, numOfOptions)) {
    return EXACT_NUMBER_OF_OPTIONS;
  }

  let fileName = options[0];
  let content = options[1];

  /*
  if(!validQuotes(content)) {
    return "String must be enclosed in quotes (\'\' or \"\")!";
  }

  content = removeQuotes(content);
  */

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

  return file.content;
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
  let directoryName = pwd() + "\n----------------\n";
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

function isOptionsStringEmpty(options) {
  return options.trim().length === 0;
}

function parseArguments(args) {
  // + " " - so the last char will always be a 
  // space (last whitespace is always trimmed) 
  // with which I can then
  // push the last token to the array  
  let argsArray = args.trim() + " ";
  let result = [];
  let insideQuotes = false;
  let token = "";
  let lastChar = "";

  for(let char of argsArray) {
    if(char === "\"") {
      insideQuotes = !insideQuotes;
    }
    
    if(char === " "  && !insideQuotes) {
      if(char !== lastChar) {
        result.push(token);
        token = "";
      }
    } else {
      token += char;
    }

    lastChar = char;
  }

  return result;
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
  let command = argumentsArray[0];
  let options = argumentsArray.slice(1);
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
console.log(tree());
let findStr = find("file1.js");
console.log(`${findStr}`);

parseArguments("mkdir hello");
parseArguments("mkdir bro");
parseArguments("mkdir \"nrp nrš\"");
parseArguments("mkdir   nrp      nrš");
parseArguments("mkdir nr p  nrš");
parseArguments("mkdir nrp nrš");