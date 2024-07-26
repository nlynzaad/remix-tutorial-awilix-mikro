import type {Contact} from "@domain/contacts/Contact";
import type {GenericRepository} from "@domain/GenericRepository/GenericRepository";
import type {Result} from "@domain/shared/Result";

export interface IContactRepository extends GenericRepository<Contact> {
	findByName(name: string): Promise<Result<Contact[]>>;
}
