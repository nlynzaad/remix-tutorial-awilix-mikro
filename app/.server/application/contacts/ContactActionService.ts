import type {Result} from "~/.server/domain/shared/Result";
import type {ContactId, IContact, IContactDomainService, NewContact} from "~/.server/domain/contacts/Contact";
import type {IContactRepository} from "~/.server/domain/contacts/IContactRepository";
import type {IContactActionService} from "~/.server/domain/contacts/IContactActionService";

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
		const dbResult = await this.#contactRepository.update(contactId, {id: contactId, favourite});

		if (dbResult.error) {
			return {error: dbResult.error}
		}

		await this.#contactRepository.save();

		return dbResult.favourite ?? false;
    }

	async addContact(contact: NewContact): Promise<Result<IContact>> {
		const newContact = this.#contactDomainService.create(contact);

		if (newContact.error) {
			return {error: newContact.error}
		}

		const dbResult = await this.#contactRepository.create(newContact);

		if (dbResult.error) {
			return {error: dbResult.error}
		}

		await this.#contactRepository.save();

		return dbResult;
	}

	async deleteContact(contactId: ContactId): Promise<Result<boolean>> {
		const dbResult = await this.#contactRepository.delete(contactId);
		console.log(dbResult)
		if (dbResult.error) {
			return {error: dbResult.error}
		}

		await this.#contactRepository.save();

		return true;
	}

	async updateContact(contactId: ContactId, contactUpdate: IContact): Promise<Result<IContact>> {
		const contactToUpdate = await this.#contactRepository.findOne(contactId);

		if (contactToUpdate.error) {
			return {error: contactToUpdate.error}
		}

		const contact = this.#contactDomainService.from(contactToUpdate);

		if (contact.error) {
			return {error: contact.error}
		}

		contact.update(contactUpdate);

		const updatedContact = await this.#contactRepository.update(contactId, contactUpdate);

		if (updatedContact.error) {
			return {error: updatedContact.error}
		}

		await this.#contactRepository.save();

		return updatedContact;
	}
}
