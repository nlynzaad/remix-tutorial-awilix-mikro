import {z, type ZodType} from "zod";
import type {RemoveFunctions} from "@shared/classes/RemoveFunctions";
import type {IDomainModel} from "@domain/DomainModel/DomainModel";

export const domainZodValidator = z.object({
	id: z.string().uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
}) satisfies ZodType<RemoveFunctions<IDomainModel>>
