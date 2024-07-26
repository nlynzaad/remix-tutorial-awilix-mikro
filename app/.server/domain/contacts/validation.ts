import {z, ZodType} from "zod";
import {fromZodError} from "zod-validation-error";
import {domainZodValidator} from "@domain/DomainModel/validation";
import {Contact} from "@domain/contacts/Contact";

import type {NewContact, UpdateContact} from "@domain/contacts/Contact";
import type {IValidator} from "@domain/shared/IValidator";
import type {RemoveFunctions} from "@shared/classes/RemoveFunctions";

const newContactZodValidator = z.object({
	first: z.string().min(2),
	last: z.string().min(2),
	avatar: z.string().url(),
	twitter: z.string().optional(),
	notes: z.string().optional(),
	favourite: z.boolean().default(false),
}) satisfies ZodType<NewContact>

const contactZodValidator = domainZodValidator.merge(newContactZodValidator) satisfies ZodType<RemoveFunctions<Contact>>

export const contactValidator: IValidator<Contact> = (contact) => {
	const validationResult = contactZodValidator.safeParse(contact);

	if (!validationResult.success) {
		return {error: fromZodError(validationResult.error)}
	}

	return validationResult.data as Contact
}

export const newContactValidator: IValidator<NewContact> = (newContact) => {
	const validationResult = newContactZodValidator.safeParse(newContact);

	if (!validationResult.success) {
		return {error: fromZodError(validationResult.error)}
	}

	return validationResult.data as NewContact
}

export const updateContactValidator: IValidator<UpdateContact> = (updateContact) => {
	const validationResult = newContactZodValidator.safeParse(updateContact);

	if (!validationResult.success) {
		return {error: fromZodError(validationResult.error)}
	}

	return validationResult.data as UpdateContact
}
