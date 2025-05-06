#!/usr/bin/env node

import { program } from "commander";
import { init } from "./commands/init.ts";

async function main() {
	program.addCommand(init);
	program.name("bt-utils CLI");
	program.description("CLI for managing bt-utils utility functions");

	program.parse();
}

main();