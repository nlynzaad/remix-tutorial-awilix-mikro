import {Contact} from "@domain/contacts/Contact";
import type {IContactRepository} from "@domain/contacts/IContactRepository";
import {Result} from "@domain/shared/Result";
import {ValidationError} from "zod-validation-error";
import type {IDbService} from "@infrastructure/database/db";
import {GenericRepository} from "@domain/GenericRepository/GenericRepository";

type InjectedDependencies = {
    dbService: IDbService;
}
export class ContactRepository extends GenericRepository<Contact> implements IContactRepository {

	constructor({dbService}: InjectedDependencies) {
        super(dbService, Contact.name)
	}

    async findByName(name: string): Promise<Result<Contact[]>> {
        try {
            return await this.dbService.find(Contact, { $or: [
                    {first: { $like: name}},
                    {last: { $like: name}}
            ]})
        } catch (e) {
            if (e instanceof ValidationError) {
                return {error: e}
            }

            if (e instanceof Error) {
                return {error: new ValidationError(e.message)}
            }

            return {error: new ValidationError('Unknown error occurred while attempting to fetch contact.')}
        }
    }
}
