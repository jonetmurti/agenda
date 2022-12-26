import type { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
	const transaction = await queryInterface.sequelize.transaction();
	try {
		await queryInterface.addIndex('agenda_jobs', {
			name: 'find_next_job_index',
			using: 'BTREE',
			fields: [
				{
					name: 'name',
					order: 'ASC'
				},
				{
					name: 'priority',
					order: 'DESC'
				},
				{
					name: 'locked_at',
					order: 'ASC'
				},
				{
					name: 'next_run_at',
					order: 'ASC'
				},
				{
					name: 'disabled',
					order: 'ASC'
				}
			],
			transaction
		});
		await transaction.commit();
	} catch (err) {
		await transaction.rollback();
		throw err;
	}
}

export async function down(queryInterface: QueryInterface): Promise<void> {
	const transaction = await queryInterface.sequelize.transaction();
	try {
		await queryInterface.removeIndex('agenda_jobs', 'find_next_job_index', { transaction });
		await transaction.commit();
	} catch (err) {
		await transaction.rollback();
		throw err;
	}
}
