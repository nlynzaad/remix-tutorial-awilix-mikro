import {Seeder} from "@mikro-orm/seeder";
import {ContactSeeder} from "./ContactSeeder";

import type {EntityManager} from "@mikro-orm/better-sqlite";

export class DatabaseSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		return this.call(em, [
			ContactSeeder
		])
	}
}
