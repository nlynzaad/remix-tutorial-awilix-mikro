import {z, ZodType} from "zod";
import type {IContact, NewContact} from "~/.server/domain/contacts/Contact";
import type {IValidator} from "~/.server/domain/shared/IValidator";
import {fromZodError} from "zod-validation-error";
import {domainZodValidator} from "~/.server/domain/shared/DomainModel/validation";

const newContactZodValidator = z.object({
	first: z.string().min(2),
	last: z.string().min(2),
	avatar: z.string().url(),
	twitter: z.string().optional(),
	notes: z.string().optional(),
	favourite: z.boolean().default(false),
}) satisfies ZodType<NewContact>

const contactZodValidator = domainZodValidator.merge(newContactZodValidator) satisfies ZodType<IContact>

export const contactValidator: IValidator<IContact> = (contact: IContact) => {
	const validationResult = contactZodValidator.safeParse(contact);

	if (!validationResult.success) {
		return {error: fromZodError(validationResult.error)}
	}

	return validationResult.data as IContact
}

export const newContactValidator: IValidator<NewContact> = (newContact: NewContact) => {
	const validationResult = newContactZodValidator.safeParse(newContact);

	if (!validationResult.success) {
		return {error: fromZodError(validationResult.error)}
	}

	return validationResult.data as NewContact
}
