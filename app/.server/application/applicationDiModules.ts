import {asClass, Lifetime} from "awilix";
import {ContactActionService} from "@application/contacts/ContactActionService";
import {ContactQueryService} from "@application/contacts/ContactQueryService";

import type {NameAndRegistrationPair} from "awilix";
import type {IContactActionService} from "@domain/contacts/IContactActionService";
import type {IContactQueryService} from "@domain/contacts/IContactQueryService";

export interface IApplicationDiModules {
	contactActionService: IContactActionService,
	contactQueryService: IContactQueryService,
}

export const ApplicationDiModules: NameAndRegistrationPair<IApplicationDiModules> = {
	contactActionService: asClass(ContactActionService, {lifetime: Lifetime.TRANSIENT}),
	contactQueryService: asClass(ContactQueryService, {lifetime: Lifetime.TRANSIENT}),
}
