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
    .slice(1) + "/";
}

function ls() {
  let array = [];

  for(let key of cwd.children.keys()) {
    array.push(key);
  }

  return array.join("\n");
};

function mkdir(directoryName) {
  if(checkIfDirectoryExists(directoryName)) {
    console.log(`Directory '${directoryName}' already exists!`);

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
  if(checkIfFileExists(fileName)) {
    console.log(`File '${fileName}' already exists!`);

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

  if(file === null) {
    return false;
  }

  console.log(file.content);

  return true;
};

function wc(fileName) {
  let file = getFile(fileName);

  if(file === null) {
    return `'${fileName}' does not exist!`;
  }

  return file.content.length;
};

function tree() {
  let directory = cwd;
  let directoryName = pwd() + "\n----------------\n";
  const depth = 0;

  return callTreeRecursive(directory, directoryName, depth);
}

function buildTreeString(child, depth) {
  let str = "";

  // indent
  for(let i = 0; i < depth * 2; i++) {
    str += " ";
  }

  str += child.name;

  if(child.type === "directory") {
    str += "/";
  }
  
  str += "\n";

  return str;
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

function find(target, directory, str) {
  for(let child of directory.children.values()) {
    if(child.name.includes(target)) {
      console.log(child.name);
    }

    if(child.type === "directory") {
      str = find(target, child, str);
    }
  }

  return str;
};

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
console.log(tree());
let findStr = find("app4.js", root, "");
console.log(`string found: ${findStr}`)