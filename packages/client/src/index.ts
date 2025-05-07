import { utilityFunctionRegistrySchema, UtilityFunctionRegistry } from "@bt/types";
import { gitHubContentResponse } from "./types";

export class UtilityFunctionCodeClient {
	private registry: UtilityFunctionRegistry | null = null;

	constructor() { }

	/**
	 * Fetch the contents of a file in this GitHub repository via the
	 * GitHub API. Note that this fetches from the main branch.
	 */
	private async getGitHubFileContent(filePath: string): Promise<string> {
		const raw = await fetch(`https://api.github.com/repos/TClark1011/base-ts-cli-lib-test/contents/${filePath}`);
		const asJson = await raw.json();
		const response = gitHubContentResponse.parse(asJson);

		const decoded = Buffer.from(response.content, response.encoding).toString("utf8");

		return decoded;
	}

	async getRegistry(): Promise<UtilityFunctionRegistry> {
		if (this.registry) {
			return this.registry;
		}

		const rawJson = await this.getGitHubFileContent("registry.json");
		const parsed = JSON.parse(rawJson);
		this.registry = utilityFunctionRegistrySchema.parse(parsed);

		return this.registry;
	}

	async getFunctionCode(name: string): Promise<string> {
		const registry = await this.getRegistry();

		const matchingFunction = registry.find((func) => func.name === name);

		if (!matchingFunction) {
			throw new Error(`Function "${name}" not found in registry`);
		}

		return this.getGitHubFileContent(matchingFunction.ts);
	}
}

const client = new UtilityFunctionCodeClient();

client.getFunctionCode('reverse').then(console.log);