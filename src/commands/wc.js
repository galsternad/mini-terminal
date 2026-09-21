"use strict"

import { getFile } from "../helpers.js";

function countLines(str) {
  const empty = 0;

  if(str.trim() === "") {
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

  if(str.trim() === "") {
    return empty;
  }

  return str
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .length;
}

export function wc(fileName) {
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