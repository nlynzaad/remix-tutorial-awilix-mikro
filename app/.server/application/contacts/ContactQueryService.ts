import {Contact, type ContactId} from "@domain/contacts/Contact";
import type {IContactQueryService} from "@domain/contacts/IContactQueryService";
import type {IContactRepository} from "@domain/contacts/IContactRepository";
import type { Result } from "@domain/shared/Result";

type InjectedDependencies = {
	contactRepository: IContactRepository;
}

export class ContactQueryService implements IContactQueryService {
	#contactRepository: IContactRepository;

	constructor({contactRepository}: InjectedDependencies) {
		this.#contactRepository = contactRepository;
	}

	async searchContact(searchTerm: string): Promise<Result<Contact[]>> {
		return await this.#contactRepository.findByName(searchTerm);
    }

    async getContact(contactId: ContactId): Promise<Result<Contact>> {
        return await this.#contactRepository.findOne(contactId);
    }

    async getContacts(): Promise<Result<Contact[]>> {
        return await this.#contactRepository.findAll();
    }
}
