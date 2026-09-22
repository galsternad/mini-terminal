"use strict";

import { parse, argumentHistory } from "./parser.js";
import { pwd } from "./commands/pwd.js";

function help(command) {

}

function save(options) {

}

function importJSON(options) {

}

function exportJSON(options) {

}

function createNewCliDiv() {
  let cliDiv = document.createElement("div");
  cliDiv.classList.add("cli-div");

  return cliDiv;
}

function createNewCliLabel() {
  let userCwdString = `user@user-pc:${pwd()} $ `;
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
  cliInput.rows = 1;
  setNewCliInput(cliInput);

  return cliInput;
}

function createNewCliResult(str) {
  let result = parse(str);
  console.log(result.data);

  let cliResult = document.createElement("pre");
  cliResult.classList.add("cli-result");
  cliResult.textContent = result.data;

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
        argumentHistory.push(result);
      }

      argumentHistory.index = argumentHistory.length;
    }
  });
}

// up/down functionality to access previous arguments
addEventListener("keydown", (e) => {
  let cliInputArray = document.getElementsByClassName("cli-input");
  let lastCliInput = cliInputArray[cliInputArray.length - 1];
  
  if(document.activeElement !== lastCliInput) {
    return;
  }
    
  if(e.key === "ArrowUp") {
    e.preventDefault();
    
    if(argumentHistory.index > 0) {
      let previousArgument = argumentHistory.argumentHistoryArray[--argumentHistory.index];
      lastCliInput.value = previousArgument;
    }
  }

  if(e.key === "ArrowDown") {
    e.preventDefault();

    if(argumentHistory.index === argumentHistory.length - 1) {
      lastCliInput.value = "";
      ++argumentHistory.index;
    }

    if(argumentHistory.index < argumentHistory.length - 1) {
      let previousArgument = argumentHistory.argumentHistoryArray[++argumentHistory.index];
      lastCliInput.value = previousArgument;
    }
  }

  if(e.key === "Tab") {

  }
});

createNewCli();