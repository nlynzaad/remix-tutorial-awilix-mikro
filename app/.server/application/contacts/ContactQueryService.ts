import type { ContactId, IContact } from "~/.server/domain/contacts/Contact";
import type {IContactQueryService} from "~/.server/domain/contacts/IContactQueryService";
import type {IContactRepository} from "~/.server/domain/contacts/IContactRepository";
import type { Result } from "~/.server/domain/shared/Result";

type InjectedDependencies = {
	contactRepository: IContactRepository;
}

export class ContactQueryService implements IContactQueryService {
	#contactRepository: IContactRepository;

	constructor({contactRepository}: InjectedDependencies) {
		this.#contactRepository = contactRepository;
	}

	async searchContact(searchTerm: string): Promise<Result<IContact[]>> {
		return await this.#contactRepository.findByName(searchTerm);
    }

    async getContact(contactId: ContactId): Promise<Result<IContact>> {
        return await this.#contactRepository.findOne(contactId);
    }

    async getContacts(): Promise<Result<IContact[]>> {
        return await this.#contactRepository.findAll();
    }
}
