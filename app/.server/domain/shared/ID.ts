import {v7} from 'uuid';
import {z, type ZodType} from "zod";
import {fromZodError} from "zod-validation-error";
import type {IValidator} from "~/.server/domain/shared/IValidator";

export type ID = string;

export const idZodValidator = z.string().uuid() satisfies ZodType<ID>

export const generateId = v7;

export const idValidator: IValidator<ID> = (id: string) => {
	const validationResult = idZodValidator.safeParse(id);

	if (!validationResult.success) {
		return {error: fromZodError(validationResult.error)}
	}

	return validationResult.data
}
