import {createContainer} from "awilix";
import {createContext} from "remix-create-express-app/context";
import type {MiddlewareFunctionArgs} from "remix-create-express-app/middleware";
import {type IInfrastructureDiModules, InfrastructureDiModules} from "@infrastructure/infrastructureDiModules";
import {DomainDiModules, type IDomainDiModules} from "@domain/domainDiModules";
import {ApplicationDiModules, type IApplicationDiModules} from "@application/applicationDiModules";

export type IDiContainer = IApplicationDiModules & IDomainDiModules & IInfrastructureDiModules;

export const diContainer = createContainer<IDiContainer>().register({
	...ApplicationDiModules,
	...DomainDiModules,
	...InfrastructureDiModules
})

export const DiContext = createContext<IDiContainer>();

export const diMiddleware = async ({context, next}: MiddlewareFunctionArgs) => {
	context.set(DiContext, diContainer.createScope().cradle)
	return next();
}
