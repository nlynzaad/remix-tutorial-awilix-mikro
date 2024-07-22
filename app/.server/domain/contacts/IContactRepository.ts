import type {IContact} from "~/.server/domain/contacts/Contact";
import type {IGenericRepository} from "~/.server/domain/shared/GenericRepository/IGenericRepository";
import type {Result} from "~/.server/domain/shared/Result";

export interface IContactRepository extends IGenericRepository<IContact> {
	findByName(name: string): Promise<Result<IContact[]>>;
}
