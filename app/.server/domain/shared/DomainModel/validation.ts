import { z } from "zod";

export const domainZodValidator = z.object({
	id: z.string().uuid(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
})
