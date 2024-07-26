import {EntitySchema} from "@mikro-orm/core";
import {Contact} from "@domain/contacts/Contact";

export const contactEntity = new EntitySchema<Contact>({
	class: Contact,
	tableName: 'tblContacts',
	properties: {
		id: {type: 'uuid', primary: true, name: 'pkiContactId'},
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
