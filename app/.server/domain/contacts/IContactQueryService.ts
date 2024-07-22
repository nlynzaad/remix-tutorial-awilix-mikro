import type {ContactId, IContact} from "~/.server/domain/contacts/Contact";
import {Result} from "~/.server/domain/shared/Result";

export interface IContactQueryService {
	getContact(contactId: ContactId): Promise<Result<IContact>>;
	searchContact(searchTerm: string): Promise<Result<IContact[]>>;
	getContacts(): Promise<Result<IContact[]>>;
}
