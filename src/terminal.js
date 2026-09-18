"use strict";

const ROOT = new Directory("/");
const EMPTY_STRING = "";
const TOO_MANY_ARGUMENTS = "Too many arguments!";

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
};

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
};

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
  if(options.length > 0) {
    return TOO_MANY_ARGUMENTS;
  }

  return result;
}

function ls() {
  let array = [];

  for(let key of cwd.children.keys()) {
    array.push(key);
  }

  return array;
};

function lsParse(options) {
  if(options.length > 0) {
    return TOO_MANY_ARGUMENTS;
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
};

function rmdir(directoryName) {
  if(!canRemoveDirectory(directoryName)) {
    return false;
  }

  cwd.children.delete(directoryName);
  console.log(`'${directoryName}' successfully deleted!`);
  cwd.lastModified = Date.now();

  return true;
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
};

function rm(fileName) {
  if(!canRemoveFile(fileName)) {
    return false;
  }

  cwd.children.delete(fileName);
  console.log(`'${fileName}' successfully deleted!`);
  cwd.lastModified = Date.now();

  return true;
}

function cd(directoryName) {
  if(directoryName === ".." && isRootDirectory()) {
    console.log("Cannot 'cd' while in root!");

    return false;
  }

  if(directoryName === ".." && cwd.parent !== null) {
    cwd = cwd.parent;
    console.log(`'cd' to ${cwd.name} successful!`);

    return true;
  }

  let tmpCwd = getDirectory(directoryName);
  
  if(tmpCwd === null) {
    return false;
  }

  cwd = tmpCwd;
  console.log(`'cd' to ${cwd.name} successful!`);

  return true;
};

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
};

function cat(fileName) {
  let file = getFile(fileName);
  const fileNotFound = `File '${fileName}' not found!`;

  if(file === null) {
    return fileNotFound;
  }

  return file.content;
};

function catParse(options) {
  if(options.length > 1) {
    return TOO_MANY_ARGUMENTS;
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
};

function wcParse(options) {
  if(options.length > 1) {
    return TOO_MANY_ARGUMENTS;
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
};

function treeParse(options) {
  if(options.length > 0) {
    return TOO_MANY_ARGUMENTS;
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
};

function findParse(options) {
  if(options.length > 1) {
    return TOO_MANY_ARGUMENTS;
  }

  let fileName = options[0];
  let result = find(fileName);

  return result;
}

function isArgumentsStringEmpty(args) {
  return args.trim().length > 0;
}

function isOptionsStringEmpty(options) {
  return options.trim().length > 0;
}

function parseArguments(args) {
  return args
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");
}

function parse(args) {
  const cannotParseEmptyString = "Cannot parse an empty string!";

  if(!isArgumentsStringEmpty(args)) {
    return cannotParseEmptyString;
  }

  let argumentsArray = parseArguments(args);
  let command = argumentsArray[0];
  let options = argumentsArray.slice(1);
  let result = EMPTY_STRING;

  switch(command) {
    case "pwd":
      result = pwdParse(options);
      break;
    case "ls":
      result = lsParse(options);
      break;
    case "wc":
      result = wcParse(options);
      break;
    case "cat":
      result = catParse(options);
      break;
    case "find":
      result = findParse(options);
      break;
    case "tree":
      result = treeParse(options);
      break;
  }

  return result;
}

function help(command) {

};

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
console.log(`${findStr}`)