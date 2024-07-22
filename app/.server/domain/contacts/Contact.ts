import {DomainModel} from "~/.server/domain/shared/DomainModel/DomainModel";
import {contactValidator, newContactValidator} from "~/.server/domain/contacts/validation";
import {staticImplements} from "~/.server/shared/classes/staticImplements";

import type {IDomainModel, IDomainService} from "~/.server/domain/shared/DomainModel/DomainModel";
import type {Exact} from "type-fest";
import type {ID} from "~/.server/domain/shared/ID";

type ContactFields = {
	first: string,
	last: string,
	avatar: string,
	twitter?: string | undefined,
	notes?: string | undefined,
	favourite?: boolean | false,
}

export type ContactId = ID;

export interface IContact extends IDomainModel, ContactFields {}

export type NewContact = ContactFields

export type UpdateContact = Omit<ContactFields, 'id'>

export class Contact extends DomainModel<IContact> implements Contact {
	first!: string;
	last!: string;
	avatar!: string;
	twitter: string | undefined;
	notes: string | undefined;
	favourite: boolean | undefined;

	constructor(contact: IContact | NewContact | Contact) {
		super('id' in contact && contact.id ? contact as unknown as Contact : undefined);
		this.first = contact.first;
		this.last = contact.last;
		this.avatar = contact.avatar;
		this.twitter = contact.twitter;
		this.notes = contact.notes;
		this.favourite = contact.favourite ?? false;
	}

	update<T extends Exact<IContact, T>>(contact: T) {
		const validationResult = contactValidator(contact);

		if ('error' in validationResult && validationResult.error) {
			return {error: validationResult.error}
		}

		this.id = contact.id;
		this.createdAt = contact.createdAt;
		this.updatedAt = contact.updatedAt;
		this.first = contact.first;
		this.last = contact.last;
		this.avatar = contact.avatar;
		this.twitter = contact.twitter;
		this.notes = contact.notes;
		this.favourite = contact.favourite ?? false;

		return true;
	}
}

export type IContactDomainService = IDomainService<Contact, IContact>;

@staticImplements<IContactDomainService>()
export class ContactDomainService {
	static from(contact: IContact) {
		const validationResult = contactValidator(contact);

		if (validationResult.error) {
			return {error: validationResult.error}
		}

		return new Contact(validationResult);
	}

	static create<T extends Exact<NewContact, T>>(newContact: T) {
		const validationResult = newContactValidator(newContact);

		if (validationResult.error) {
			return {error: validationResult.error}
		}

		return new Contact(validationResult);
	}
}
