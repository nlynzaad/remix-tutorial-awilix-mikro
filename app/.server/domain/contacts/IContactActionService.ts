import type {ContactId, IContact, NewContact} from "~/.server/domain/contacts/Contact";
import type {Result} from "~/.server/domain/shared/Result";

export interface IContactActionService {
	addContact(newContact: NewContact):  Promise<Result<IContact>>;
	deleteContact(contact: ContactId): Promise<Result<boolean>>;
	updateContact(contactId: ContactId, contactUpdate: IContact): Promise<Result<IContact>>;
	toggleFavourite(contactId: ContactId, favourite: boolean): Promise<Result<boolean>>;
}
