"use strict";

export function date() {
  let result = "";

  let currentTime = Date.now();
  
  result = new Date(currentTime);

  return result.toString();
}