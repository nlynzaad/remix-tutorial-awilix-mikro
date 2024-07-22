import {asFunction, Lifetime} from "awilix";
import type {NameAndRegistrationPair} from "awilix";
import {ContactDomainService, type IContactDomainService} from "~/.server/domain/contacts/Contact";

export interface IDomainDiModules {
	contactDomainService: IContactDomainService;
}

export const DomainDiModules: NameAndRegistrationPair<IDomainDiModules> = {
	contactDomainService: asFunction(() => ContactDomainService, {lifetime: Lifetime.TRANSIENT}),
}
