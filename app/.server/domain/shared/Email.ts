import {z} from "zod";
import type {IValidator} from "~/.server/domain/shared/IValidator";
import {fromZodError} from "zod-validation-error";

export type Email = string;

export const emailZodValidator = z.string().email()

export const emailValidator: IValidator<Email> = (email: Email) => {
	const validationResult = emailZodValidator.safeParse(email);

	if (!validationResult.success) {
		return {error: fromZodError(validationResult.error)}
	}

	return validationResult.data
}
