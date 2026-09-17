"use strict";

const root = new Directory("/");

let cwd = root;

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
  content = "",
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
  return cwd === root;
}

function isDirectory(directoryName) {
  return cwd.children.get(directoryName).type === "directory";
}

function checkIfDirectoryExists(directoryName) {
  return cwd.children.has(directoryName);
}

function isFile(fileName) {
  return cwd.children.get(fileName).type === "file";
}

function checkIfFileExists(fileName) {
  return cwd.children.has(fileName);
}

function getDirectory(directoryName) {
  if(!checkIfDirectoryExists(directoryName)) {
    console.log(`Directory '${directoryName}' does not exist!`);
    
    return null;
  }

  if(!isDirectory(directoryName)) {
    console.log(`'${directoryName}' is not a directory!`);
    
    return null;
  }

  return cwd.children.get(directoryName);
}

function getFile(fileName) {
  if(!checkIfFileExists(fileName)) {
    console.log(`File '${fileName}' does not exist!`);
    
    return null;
  }

  if(!isFile(fileName)) {
    console.log(`'${fileName}' is not a file!`);
    
    return null;
  }

  return cwd.children.get(fileName)
}

function mkdir(directoryName) {
  if(checkIfDirectoryExists(directoryName)) {
    console.log(`Directory '${directoryName}' already exists!`);

    return false;
  }

  let newDirectory = new Directory(directoryName, cwd);
  cwd.children.set(directoryName, newDirectory);
  console.log(`Directory '${directoryName}' created!`);

  return true;
};

function touch(fileName) {
  if(checkIfFileExists(fileName)) {
    console.log(`File '${fileName}' already exists!`);

    return false;
  }

  let newFile = new File(fileName, cwd);
  cwd.children.set(fileName, newFile);
  console.log(`File '${fileName}' created!`);

  return true;
};

function ls() {
  let str = "";

  for(let key of cwd.children.keys()) {
    str += key + " ";
  }

  return str;
};

function pwd() {
  if(cwd === root) {
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

  if(file === null) {
    return false;
  }

  console.log(file.content);

  return true;
};