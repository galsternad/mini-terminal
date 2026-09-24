"use strict";

export function date(options, flags) {
  let result = "";

  let currentTime = Date.now();
  
  result = new Date(currentTime);
  console.log(result);

  return result.toString();
}