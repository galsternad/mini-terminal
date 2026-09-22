"use strict";

import commandsData from "./commands.json" with { type: "json" };

export const commands = JSON.parse(JSON.stringify(commandsData));

export function getHelpString(command) {
  let helpString = "";
  helpString += `${command["description"]}\n${command["usage"]}\n\nOptions:\n`;

  for(let flag of Object.values(command["flags"])) {
    helpString += `${flag}\n`;
  }

  return helpString;
}