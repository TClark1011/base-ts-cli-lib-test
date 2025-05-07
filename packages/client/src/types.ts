import { z } from "zod";

const zBufferEncoding = z.enum(["utf8", "base64", "hex", "latin1", "binary", "ascii"]);

export const gitHubContentResponse = z.object({
	encoding: zBufferEncoding,
	content: z.string(),
})
