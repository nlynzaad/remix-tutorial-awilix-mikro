import {EntityManager, MikroORM, Options} from '@mikro-orm/better-sqlite';
import {config} from "./config";

export interface IDbService extends EntityManager {}

interface Orm {
	orm: MikroORM;
	em: EntityManager;
}

let cache: Orm;

export async function initORM(options?: Options) {
	if (cache) {
		return cache;
	}

	const orm = await MikroORM.init({...config, ...options});

	return (cache = {
		orm,
		em: orm.em,
	});
}
