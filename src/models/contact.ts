import { DataType } from 'quantava';
import database from '../messaging/database.ts';

export const contactsDb = database.define('contacts', {
	id: { type: DataType.STRING, primaryKey: true },
	lid: { type: DataType.STRING, allowNull: true },
	name: { type: DataType.STRING, allowNull: true },
	notify: { type: DataType.STRING, allowNull: true },
	verifiedName: { type: DataType.STRING, allowNull: true },
	imgUrl: { type: DataType.STRING, allowNull: true },
	status: { type: DataType.STRING, allowNull: true },
});
