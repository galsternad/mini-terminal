"use strict";

import commandsData from "./commands.json" with { type: "json" };

export const commands = JSON.parse(JSON.stringify(commandsData));