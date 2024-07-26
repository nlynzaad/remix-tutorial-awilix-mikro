import type {Contact} from "@domain/contacts/Contact";
import type {Result} from "@domain/shared/Result";
import {GenericRepository} from "@infrastructure/GenericRepository/GenericRepository";

export interface IContactRepository extends GenericRepository<Contact> {
	findByName(name: string): Promise<Result<Contact[]>>;
}
