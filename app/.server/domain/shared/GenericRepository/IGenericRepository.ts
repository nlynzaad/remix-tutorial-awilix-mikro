import type {Result} from "~/.server/domain/shared/Result";
import type {ID} from "~/.server/domain/shared/ID";

export interface IGenericRepository<T> {
	findOne(Id: ID): Promise<Result<T>>;
	findAll(): Promise<Result<T[]>>;
	create(data: T): Promise<Result<T>>;
	update(Id: ID, data: { id: ID } & Partial<T>): Promise<Result<T>>;
	delete(Id: ID): Promise<Result<boolean>>;
	save(): Promise<Result<void>>;
}
