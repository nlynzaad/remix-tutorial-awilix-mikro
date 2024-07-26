import type {Result} from "@domain/shared/Result";
import type {ContactId, Contact, IContactDomainService, NewContact, UpdateContact} from "@domain/contacts/Contact";
import type {IContactRepository} from "@domain/contacts/IContactRepository";
import type {IContactActionService} from "@domain/contacts/IContactActionService";

type InjectedDependencies = {
	contactDomainService: IContactDomainService;
	contactRepository: IContactRepository;
}

export class ContactActionService implements IContactActionService {
	#contactRepository: IContactRepository;
	#contactDomainService: IContactDomainService;

	constructor({contactRepository, contactDomainService}: InjectedDependencies) {
		this.#contactRepository = contactRepository;
		this.#contactDomainService = contactDomainService;
	}

	async toggleFavourite(contactId: ContactId, favourite: boolean): Promise<Result<boolean>> {
		const dbResult = this.#contactRepository.update(contactId, {favourite});

		if (dbResult.error) {
			return {error: dbResult.error}
		}

		await this.#contactRepository.save();

		return favourite;
    }

	async addContact(contact: NewContact): Promise<Result<Contact>> {
		const newContact = this.#contactDomainService.create(contact);

		if (newContact.error) {
			return {error: newContact.error}
		}

		const dbResult = this.#contactRepository.create(newContact);

		if (dbResult.error) {
			return {error: dbResult.error}
		}

		await this.#contactRepository.save();

		return newContact;
	}

	async deleteContact(contactId: ContactId): Promise<Result<boolean>> {
		const dbResult = this.#contactRepository.delete(contactId);

		if (dbResult.error) {
			return {error: dbResult.error}
		}

		await this.#contactRepository.save();

		return true;
	}

	async updateContact(contactId: ContactId, contactUpdate: UpdateContact): Promise<Result<Contact>> {
		const contactToUpdate = await this.#contactRepository.findOne(contactId);

		if (contactToUpdate.error) {
			return {error: contactToUpdate.error}
		}

		const contact = this.#contactDomainService.from(contactToUpdate);

		if (contact.error) {
			return {error: contact.error}
		}

		contact.update(contactUpdate);

		const updatedContact = this.#contactRepository.update(contactId, contact);

		if (updatedContact.error) {
			return {error: updatedContact.error}
		}

		await this.#contactRepository.save();

		return contact;
	}
}
