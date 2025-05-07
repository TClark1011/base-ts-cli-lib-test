import { z } from "zod";

export const utilityFunctionRegistrationSchema = z.object({
	name: z.string(),
	group: z.string(), // eg. "array", "string"
	ts: z.string(), // file path to typescript file
	js: z.string(), // file path to javascript file
})

export type UtilityFunctionRegistration = z.infer<typeof utilityFunctionRegistrationSchema>;

export const utilityFunctionRegistrySchema = utilityFunctionRegistrationSchema.array();

export type UtilityFunctionRegistry = z.infer<typeof utilityFunctionRegistrySchema>;