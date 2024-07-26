import type {Contact, ContactId, NewContact} from "@domain/contacts/Contact";
import type {Result} from "@domain/shared/Result";

export interface IContactActionService {
	addContact(newContact: NewContact):  Promise<Result<Contact>>;
	deleteContact(contact: ContactId): Promise<Result<boolean>>;
	updateContact(contactId: ContactId, contactUpdate: Contact): Promise<Result<Contact>>;
	toggleFavourite(contactId: ContactId, favourite: boolean): Promise<Result<boolean>>;
}
