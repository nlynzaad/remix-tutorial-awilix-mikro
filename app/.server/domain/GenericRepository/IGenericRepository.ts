import type {Result} from "@domain/shared/Result";
import type {ID} from "@domain/shared/ID";

export interface IGenericRepository<T> {
	findOne(Id: ID): Promise<Result<T>>;
	findAll(): Promise<Result<T[]>>;
	create(data: T): Result<boolean>;
	update(id: ID, data: Partial<T>): Result<boolean>;
	delete(id: ID): Result<boolean>;
	save(): Promise<Result<void>>;
}

