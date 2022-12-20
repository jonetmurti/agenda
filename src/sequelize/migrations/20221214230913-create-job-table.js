module.exports = {
	async up(queryInterface, Sequelize, ensureIndex) {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.createTable(
				'agenda_jobs',
				{
					_id: {
						type: Sequelize.UUID,
						defaultValue: Sequelize.UUIDV4,
						primaryKey: true,
						allowNull: false
					},
					name: {
						type: Sequelize.STRING,
						allowNull: false
					},
					priority: {
						type: Sequelize.INTEGER,
						allowNull: false
					},
					next_run_at: {
						type: Sequelize.DATE,
						defaultValue: null,
						allowNull: true
					},
					type: {
						type: Sequelize.ENUM({
							values: ['normal', 'single']
						}),
						allowNull: false
					},
					locked_at: {
						type: Sequelize.DATE,
						defaultValue: null,
						allowNull: true
					},
					last_finished_at: {
						type: Sequelize.DATE,
						defaultValue: null,
						allowNull: true
					},
					failed_at: {
						type: Sequelize.DATE,
						defaultValue: null,
						allowNull: true
					},
					fail_count: {
						type: Sequelize.INTEGER,
						defaultValue: 0,
						allowNull: false
					},
					fail_reason: {
						type: Sequelize.STRING,
						defaultValue: null,
						allowNull: true
					},
					repeat_timezone: {
						type: Sequelize.STRING,
						defaultValue: null,
						allowNull: true
					},
					last_run_at: {
						type: Sequelize.DATE,
						defaultValue: null,
						allowNull: true
					},
					repeat_interval: {
						type: Sequelize.STRING,
						defaultValue: null,
						allowNull: true
					},
					data: {
						type: Sequelize.JSON,
						defaultValue: null,
						allowNull: true
					},
					repeat_at: {
						type: Sequelize.STRING,
						defaultValue: null,
						allowNull: true
					},
					disabled: {
						type: Sequelize.BOOLEAN,
						defaultValue: false,
						allowNull: false
					},
					progress: {
						type: Sequelize.INTEGER,
						defaultValue: null,
						allowNull: true
					},
					last_modified_by: {
						type: Sequelize.STRING,
						defaultValue: null,
						allowNull: true
					},
					fork: {
						type: Sequelize.BOOLEAN,
						defaultValue: false,
						allowNull: false
					}
				},
				{ transaction }
			);
			if (ensureIndex) {
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
			}
			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	},
	async down(queryInterface, _Sequelize) {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.dropTable('agenda_jobs', { transaction });
			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	}
};
