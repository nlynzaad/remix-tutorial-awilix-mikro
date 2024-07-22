import {asClass, Lifetime} from "awilix";
import {ContactActionService} from "~/.server/application/contacts/ContactActionService";
import {ContactQueryService} from "~/.server/application/contacts/ContactQueryService";

import type {NameAndRegistrationPair} from "awilix";
import type {IContactActionService} from "~/.server/domain/contacts/IContactActionService";
import type {IContactQueryService} from "~/.server/domain/contacts/IContactQueryService";

export interface IApplicationDiModules {
	contactActionService: IContactActionService,
	contactQueryService: IContactQueryService,
}

export const ApplicationDiModules: NameAndRegistrationPair<IApplicationDiModules> = {
	contactActionService: asClass(ContactActionService, {lifetime: Lifetime.TRANSIENT}),
	contactQueryService: asClass(ContactQueryService, {lifetime: Lifetime.TRANSIENT}),
}
