import type {ContactId, Contact} from "@domain/contacts/Contact";
import {Result} from "@domain/shared/Result";

export interface IContactQueryService {
	getContact(contactId: ContactId): Promise<Result<Contact>>;
	searchContact(searchTerm: string): Promise<Result<Contact[]>>;
	getContacts(): Promise<Result<Contact[]>>;
}
