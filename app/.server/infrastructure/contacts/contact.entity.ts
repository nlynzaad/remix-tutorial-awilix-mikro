import {EntitySchema} from "@mikro-orm/core";
import type {IContact} from "~/.server/domain/contacts/Contact.ts";

const entityName = 'Contact';

const contactEntitySchema = new EntitySchema<IContact>({
	name: entityName,
	tableName: 'tblContacts',
	properties: {
		id: {type: 'uuid', primary: true},
		first: {type: 'string', name: 'txtFirstname'},
		last: {type: 'string', name: 'txtLastname'},
		avatar: {type: 'string', name: 'txtAvatarUrl'},
		twitter: {type: 'string', name: 'txtTwitter', nullable: true},
		notes: {type: 'string', name: 'txtNotes', nullable: true},
		favourite: {type: 'boolean', default: false, name: 'blnFavourite'},
		createdAt: {type: 'datetime', name: 'dteCreatedBy', onCreate: () => new Date()},
		updatedAt: {type: 'datetime', name: 'dteUpdatedBy', onCreate: () => new Date(), onUpdate: () => new Date()},
	}
});

export const contactEntity = {name: entityName, schema: contactEntitySchema};
