// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck mikro-orm cli expects file extension for listed entities
import {Seeder} from "@mikro-orm/seeder";
import {ContactSeeder} from "./ContactSeeder.ts";

import type {EntityManager} from "@mikro-orm/better-sqlite";

export class DatabaseSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		return this.call(em, [
			ContactSeeder
		])
	}
}
