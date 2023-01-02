import type { Sequelize, QueryInterface } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { up as doCreateJobTable, down as undoCreateJobTable } from './create-job-table';
import { up as doCreateJobIndex, down as undoCreateJobIndex } from './create-job-index';

export class Migration {
	private umzug: Umzug<QueryInterface>;

	constructor(sequelize: Sequelize, private ensureIndex?: boolean) {
		this.umzug = new Umzug({
			migrations: [
				{
					name: 'create-job-table',
					up: ({ context }) => doCreateJobTable(context),
					down: ({ context }) => undoCreateJobTable(context)
				},
				{
					name: 'create-job-index',
					up: ({ context }) => doCreateJobIndex(context),
					down: ({ context }) => undoCreateJobIndex(context)
				}
			],
			context: sequelize.getQueryInterface(),
			storage: new SequelizeStorage({
				sequelize,
				tableName: 'agenda_migration_meta'
			}),
			logger: undefined
		});
	}

	async migrate(): Promise<void> {
		if (this.ensureIndex) {
			await this.umzug.up();
		} else {
			const pendings = await this.umzug.pending();
			const migrations: string[] = [];
			pendings.forEach(pending => {
				if (pending.name !== 'create-job-index') {
					migrations.push(pending.name);
				}
			});
			if (migrations.length > 0) {
				await this.umzug.up({ migrations });
			}
		}
	}

	async undoMigrate(): Promise<void> {
		await this.umzug.down({ to: 0 });
	}
}
