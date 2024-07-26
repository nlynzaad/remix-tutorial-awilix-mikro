import {defineConfig, ReflectMetadataProvider} from "@mikro-orm/better-sqlite";
import {Migrator} from "@mikro-orm/migrations";

import {SeedManager} from "@mikro-orm/seeder";
import {contactEntity} from "@infrastructure/contacts/contact.entity";

export const config = defineConfig({
	entities: [contactEntity],
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
	forceUndefined: true
});
