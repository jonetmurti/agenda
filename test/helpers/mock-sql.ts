import * as debug from 'debug';
import { Dialect, Sequelize } from 'sequelize';
import { Migration } from '../../src/sequelize/migrations';
import { initModel } from '../../src/sequelize/models/job';

const log = debug('agenda:mock-sql');

export interface IMockSql {
	disconnect: () => Promise<void>;
	sequelize: Sequelize;
	address: string;
	dialect: Dialect;
}

export async function mockSql(): Promise<IMockSql> {
	const self: IMockSql = {} as any;
	// self.address = 'postgres://postgres:postgres@localhost:5432/agenda_db';
	// self.dialect = 'postgres';
	// self.address = 'mysql://root:root@localhost:3306/agenda_db';
	// self.dialect = 'mysql';
	self.address = process.env.CI_DB_ADDRESS as string;
	self.dialect = process.env.CI_DB_DIALECT as Dialect;
	self.sequelize = new Sequelize(self.address, {
		dialect: self.dialect,
		logging: false
	});
	initModel(self.sequelize);
	const migration = new Migration(self.sequelize, false);
	await migration.undoMigrate();
	await migration.migrate();
	self.disconnect = async function () {
		await self.sequelize.close();
	};

	return self;
}
