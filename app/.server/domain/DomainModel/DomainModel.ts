import {generateId, type ID} from "@domain/shared/ID";
import { isEqual } from "@shared/objects/isEqual";
import type {Result, UpdateResult} from "@domain/shared/Result";

export interface IDomainModel {
	id: ID,
	createdAt: Date,
	updatedAt: Date,
}

export interface IDomainService<T, U> {
	from(entity: U): Result<T>;
	create(entity: Partial<U>): Result<T>;
}

export abstract class DomainModel<T extends IDomainModel> implements IDomainModel  {
	id: ID;
	createdAt: Date;
	updatedAt: Date;

	protected constructor(domainModel?: T) {
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

	abstract update<V extends Omit<T,'id' | 'updatedAt' | 'createdAt'>>(entity: V): UpdateResult;

	isEqual(other: T): boolean {
		return isEqual(this, other);
	}
}
