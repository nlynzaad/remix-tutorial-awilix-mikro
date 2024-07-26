import {DomainModel} from "@domain/DomainModel/DomainModel";
import {contactValidator, newContactValidator} from "@domain/contacts/validation";
import {staticImplements} from "@shared/classes/staticImplements";

import type {Exact} from "type-fest";
import type {IDomainModel, IDomainService} from "@domain/DomainModel/DomainModel";
import type {ID} from "@domain/shared/ID";
import type {UpdateResult} from "@domain/shared/Result";

type ContactFields = {
	first: string,
	last: string,
	avatar: string,
	twitter?: string | undefined,
	notes?: string | undefined,
	favourite?: boolean | false,
}

export type ContactId = ID;

type UserModel = IDomainModel & ContactFields

export type NewContact = ContactFields

export type UpdateContact = Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>

export class Contact extends DomainModel<UserModel> {
	first!: string;
	last!: string;
	avatar!: string;
	twitter?: string | undefined;
	notes?: string | undefined;
	favourite?: boolean | undefined;

	constructor(contact: UserModel | NewContact | Contact) {
		super('id' in contact && contact.id ? contact as unknown as Contact : undefined);
		this.first = contact.first;
		this.last = contact.last;
		this.avatar = contact.avatar;
		this.twitter = contact.twitter;
		this.notes = contact.notes;
		this.favourite = contact.favourite;
	}

	update(contact: UpdateContact): UpdateResult {
		const validationResult = contactValidator(contact);

		if ('error' in validationResult && validationResult.error) {
			return {error: validationResult.error}
		}

		this.first = contact.first;
		this.last = contact.last;
		this.avatar = contact.avatar;
		this.twitter = contact.twitter;
		this.notes = contact.notes;
		this.favourite = contact.favourite;

		return true;
	}
}

export type IContactDomainService = IDomainService<Contact, UserModel>;

@staticImplements<IContactDomainService>()
export class ContactDomainService {
	static from(contact: UserModel) {
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
