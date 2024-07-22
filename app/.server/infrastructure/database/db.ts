import {EntityManager, MikroORM, Options} from '@mikro-orm/better-sqlite';
import {config} from "./config";

export interface IDbService extends EntityManager {}

export class DbConnector {
	static #orm: MikroORM;

	static async init(options?: Options) {
		if (!this.#orm) {
			this.#orm = await MikroORM.init({...config, ...options});
		}
	}

	static get orm() {
		if (!this.#orm) {
			throw new Error("Orm is not initialized!")
		}

		return this.#orm;
	}
}
