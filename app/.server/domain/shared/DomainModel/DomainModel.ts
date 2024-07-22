import {generateId, type ID} from "~/.server/domain/shared/ID";
import type {Exact} from "type-fest";
import type {Result, UpdateResult} from "~/.server/domain/shared/Result";
import { isEqual } from "~/.server/shared/objects/isEqual";

export interface IDomainModel {
	id: ID,
	createdAt?: Date | undefined,
	updatedAt?: Date | undefined,
}

export interface IDomainService<T, U> {
	from(entity: U): Result<T>;
	create(entity: Partial<U>): Result<T>;
}

export abstract class DomainModel<T extends IDomainModel> implements IDomainModel  {
	id: ID;
	createdAt: Date | undefined;
	updatedAt: Date | undefined;

	protected constructor(domainModel?: IDomainModel) {
		if (domainModel) {
			this.id = domainModel.id;
			this.updatedAt = domainModel.updatedAt;
			this.createdAt = domainModel.createdAt;

			return
		}

		this.id = generateId();
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}

	abstract update<V extends Exact<T, V>>(entity: V): UpdateResult;

	isEqual(other: T): boolean {
		return isEqual(this, other);
	}
}
