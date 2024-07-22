// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck mikro-orm cli expects file extension for listed entities
import {defineConfig, EntityCaseNamingStrategy, ReflectMetadataProvider} from "@mikro-orm/better-sqlite";
import {Migrator} from "@mikro-orm/migrations";
import pluralize from "pluralize";

import {contactEntity} from '../contacts/contact.entity.ts';

import type {NamingStrategy} from "@mikro-orm/better-sqlite";
import {SeedManager} from "@mikro-orm/seeder";

class TableNamingStrategy extends EntityCaseNamingStrategy implements NamingStrategy {
	classToTableName(entityName: string): string {
		return `tbl` + pluralize(entityName);
	}
}

export const config = defineConfig({
	entities: [contactEntity.schema],
	dbName: './database/contacts.db',
	migrations: {
		path: './app/.server/infrastructure/database/migrations',
	},
	seeder: {
		defaultSeeder: 'DatabaseSeeder',
		path: './app/.server/infrastructure/database/seeders',
	},
	extensions: [Migrator, SeedManager],
	metadataProvider: ReflectMetadataProvider,
	namingStrategy: TableNamingStrategy,
	forceUndefined: true
});
