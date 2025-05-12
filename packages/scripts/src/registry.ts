/**
 * This script acts as a type-safe way to write the registry file
 */

import { UtilityFunctionRegistry, utilityFunctionRegistrySchema } from "@bt/shared";
import path from "path";
import fs from "fs";

// WRITE REGISTRY HERE
const REGISTRY: UtilityFunctionRegistry = [
	{
		name: 'reverse',
		group: 'array',
		ts: 'packages/lib/src/array/reverse.ts',
		js: 'packages/lib/js/array/reverse.js',
	}
];

utilityFunctionRegistrySchema.parse(REGISTRY);

// Then we write it to the registry.json file

const filePath = path.join(process.cwd(), '../../registry.json');
fs.writeFile(filePath, JSON.stringify(REGISTRY), (err) => {
	if (err) {
		console.error('Error writing file:', err);
	} else {
		console.log('File has been written successfully');
	}
});