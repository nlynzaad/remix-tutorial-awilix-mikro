import {DomainModel, type IDomainModel} from "@domain/DomainModel/DomainModel";
import type {IDbService} from "@infrastructure/database/db";
import type {Result} from "@domain/shared/Result";
import {ValidationError} from "zod-validation-error";
import pluralize from "pluralize";
import type {ID} from "@domain/shared/ID";
import type {EntityDTO, Loaded} from "@mikro-orm/core";
import type {IGenericRepository} from "@domain/GenericRepository/IGenericRepository";

export class GenericRepository<T extends IDomainModel> implements IGenericRepository<T> {
	readonly #entityName: string;
	protected readonly dbService: IDbService;

	constructor(dbService: IDbService, entity: string) {
		this.#entityName = entity;
		this.dbService = dbService;
	}

	async findAll(): Promise<Result<T[]>> {
		try {
			const result = await this.dbService.findAll<T>(this.#entityName)

			if (!result) {
				return {error: new ValidationError(`No ${pluralize(this.#entityName.toLowerCase())} found`)}
			}

			return result;
		} catch (e) {
			if (e instanceof ValidationError) {
				return {error: e}
			}

			if (e instanceof Error) {
				return {error: new ValidationError(e.message)}
			}

			return {error: new ValidationError(`Unknown error occurred while attempting to fetch ${pluralize(this.#entityName.toLowerCase())}.`)}
		}
	}

	async findOne(Id: ID): Promise<Result<T>> {
		try {
			const result = (await this.dbService.findOne(this.#entityName, Id)) as unknown as Loaded<T>;

			if (!result) {
				return {error: new ValidationError(`${this.#entityName} not found`)}
			}

			return result;
		} catch (e) {
			if (e instanceof ValidationError) {
				return {error: e}
			}

			if (e instanceof Error) {
				return {error: new ValidationError(e.message)}
			}

			return {error: new ValidationError(`Unknown error occurred while attempting to fetch ${this.#entityName.toLowerCase()}.`)}
		}
	}

	create(data: T): Result<boolean> {
		try {
			this.dbService.persist<T>(data);

			return true;
		} catch (e) {
			if (e instanceof ValidationError) {
				return {error: e}
			}

			if (e instanceof Error) {
				return {error: new ValidationError(e.message)}
			}

			return {error: new ValidationError(`Unknown error occurred while attempting to create ${this.#entityName.toLowerCase()}.`)}
		}
	}

	update(id: ID, data: Partial<T>): Result<boolean> {
		try {
			const ref = this.dbService.getReference(this.#entityName, id)
			this.dbService.assign(ref, data as Partial<EntityDTO<DomainModel<T>>>);
			return true
		} catch (e) {
			if (e instanceof ValidationError) {
				return {error: e}
			}

			if (e instanceof Error) {
				return {error: new ValidationError(e.message)}
			}

			return {error: new ValidationError(`Unknown error occurred while attempting to update ${this.#entityName.toLowerCase()}.`)}
		}
	}

	delete(id: ID): Result<boolean> {
		try {
			const result = this.dbService.getReference(this.#entityName, id)

			this.dbService.remove(result);

			return true;
		} catch (e) {
			if (e instanceof ValidationError) {
				return {error: e}
			}

			if (e instanceof Error) {
				return {error: new ValidationError(e.message)}
			}

			return {error: new ValidationError(`Unknown error occurred while attempting to delete ${this.#entityName.toLowerCase()}.`)}
		}
	}

	async save(): Promise<Result<void>> {
		await this.dbService.flush();
	}
}
