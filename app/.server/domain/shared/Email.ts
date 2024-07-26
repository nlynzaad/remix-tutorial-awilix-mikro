import {z} from "zod";
import {fromZodError} from "zod-validation-error";

import type {IValidator} from "@domain/shared/IValidator";

export type Email = string;

export const emailZodValidator = z.string().email()

export const emailValidator: IValidator<Email> = (email) => {
	const validationResult = emailZodValidator.safeParse(email);

	if (!validationResult.success) {
		return {error: fromZodError(validationResult.error)}
	}

	return validationResult.data
}
