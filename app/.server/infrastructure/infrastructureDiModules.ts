import {asClass, asFunction, Lifetime} from "awilix";
import {initORM} from "~/.server/infrastructure/database/db";
import {ContactRepository} from "~/.server/infrastructure/contacts/contact.repository";

import type {NameAndRegistrationPair} from "awilix";
import type {IDbService} from "~/.server/infrastructure/database/db";
import type {IContactRepository} from "~/.server/domain/contacts/IContactRepository";

export interface IInfrastructureDiModules {
	dbService: Promise<IDbService>,
	contactRepository: IContactRepository,
}

export const InfrastructureDiModules: NameAndRegistrationPair<IInfrastructureDiModules> = {
	dbService: asFunction(async () => (await initORM()).em.fork(), {lifetime: Lifetime.TRANSIENT}),
	contactRepository: asClass(ContactRepository, {lifetime: Lifetime.TRANSIENT}),
}
