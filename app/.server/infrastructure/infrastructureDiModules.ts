import {asClass, asFunction, Lifetime} from "awilix";
import {DbConnector} from "@infrastructure/database/db";
import {ContactRepository} from "@infrastructure/contacts/contact.repository";

import type {NameAndRegistrationPair} from "awilix";
import type {IDbService} from "@infrastructure/database/db";
import type {IContactRepository} from "@domain/contacts/IContactRepository";

export interface IInfrastructureDiModules {
	dbService: IDbService,
	contactRepository: IContactRepository,
}

export const InfrastructureDiModules: NameAndRegistrationPair<IInfrastructureDiModules> = {
	dbService: asFunction(() => DbConnector.orm.em.getContext(), {lifetime: Lifetime.SCOPED}),
	contactRepository: asClass(ContactRepository, {lifetime: Lifetime.SCOPED}),
}
