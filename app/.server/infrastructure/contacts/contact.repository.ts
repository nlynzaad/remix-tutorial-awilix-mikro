import { IContact } from "~/.server/domain/contacts/Contact";
import type {IContactRepository} from "~/.server/domain/contacts/IContactRepository";
import {ID} from "~/.server/domain/shared/ID";
import {Result} from "~/.server/domain/shared/Result";
//@ts-expect-error mikro-orm cli expects file extension
import {contactEntity} from "~/.server/infrastructure/contacts/contact.entity.ts";
import {ValidationError} from "zod-validation-error";
import {wrap} from "@mikro-orm/core";
import type {IDbService} from "~/.server/infrastructure/database/db";

type InjectedDependencies = {
    dbService: IDbService;
}
export class ContactRepository implements IContactRepository {
	#dbService: IDbService;

	constructor({dbService}: InjectedDependencies) {
        this.#dbService = dbService;
	}

    async findByName(name: string): Promise<Result<IContact[]>> {
        try {
            const contacts = await this.#dbService.find<IContact>(contactEntity.name, { $or: [
                    {first: { $like: name}},
                    {last: { $like: name}}
            ]})

            return contacts;
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

    async findOne(Id: ID): Promise<Result<IContact>> {
        try {
            const contact = await this.#dbService.findOne<IContact>(contactEntity.name, Id)

            if (!contact) {
                return {error: new ValidationError('Contact not found')}
            }

            return contact;
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

    async findAll(): Promise<Result<IContact[]>> {
        try {
            console.log(this.#dbService)
            const contacts = await this.#dbService.findAll<IContact>(contactEntity.name)

            if (!contacts) {
                return {error: new ValidationError('No contacts found')}
            }

            return contacts;
        } catch (e) {
            if (e instanceof ValidationError) {
                return {error: e}
            }

            if (e instanceof Error) {
                return {error: new ValidationError(e.message)}
            }

            return {error: new ValidationError('Unknown error occurred while attempting to fetch contacts.')}
        }
    }

    async create(data: IContact): Promise<Result<IContact>> {
        try {
            const contact = this.#dbService.create<IContact>(contactEntity.name, {...data, id: data.id})

            if (!contact) {
                return {error: new ValidationError('Error creating contact')}
            }

            return data;
        } catch (e) {
            if (e instanceof ValidationError) {
                return {error: e}
            }

            if (e instanceof Error) {
                return {error: new ValidationError(e.message)}
            }

            return {error: new ValidationError('Unknown error occurred while attempting to create contact.')}
        }
    }

    async update(Id: ID, data: IContact): Promise<Result<IContact>> {
        try {
            const contact = await this.#dbService.findOne<IContact>(contactEntity.name, Id)

            if (!contact) {
                return {error: new ValidationError('Error finding contact')}
            }

            return wrap(contact).assign(data, { updateByPrimaryKey: true });
        } catch (e) {
            if (e instanceof ValidationError) {
                return {error: e}
            }

            if (e instanceof Error) {
                return {error: new ValidationError(e.message)}
            }

            return {error: new ValidationError('Unknown error occurred while attempting to update contact.')}
        }
    }

    async delete(Id: ID): Promise<Result<boolean>> {
        try {
            const contact = await this.#dbService.findOne<IContact>(contactEntity.name, Id)

            if (!contact) {
                return {error: new ValidationError('Error finding contact')}
            }

            this.#dbService.remove<IContact>(contact);

            return true;
        } catch (e) {
            if (e instanceof ValidationError) {
                return {error: e}
            }

            if (e instanceof Error) {
                return {error: new ValidationError(e.message)}
            }

            return {error: new ValidationError('Unknown error occurred while attempting to delete contact.')}
        }
    }

    async save(): Promise<Result<void>> {
        await this.#dbService.flush();
    }
}
