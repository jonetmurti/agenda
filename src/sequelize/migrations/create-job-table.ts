import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
	const transaction = await queryInterface.sequelize.transaction();
	try {
		await queryInterface.createTable(
			'agenda_jobs',
			{
				_id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
					allowNull: false
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false
				},
				priority: {
					type: DataTypes.INTEGER,
					allowNull: false
				},
				next_run_at: {
					type: DataTypes.DATE(6),
					defaultValue: null,
					allowNull: true
				},
				type: {
					type: DataTypes.ENUM({
						values: ['normal', 'single']
					}),
					allowNull: false
				},
				locked_at: {
					type: DataTypes.DATE(6),
					defaultValue: null,
					allowNull: true
				},
				last_finished_at: {
					type: DataTypes.DATE(6),
					defaultValue: null,
					allowNull: true
				},
				failed_at: {
					type: DataTypes.DATE(6),
					defaultValue: null,
					allowNull: true
				},
				fail_count: {
					type: DataTypes.INTEGER,
					defaultValue: null,
					allowNull: true
				},
				fail_reason: {
					type: DataTypes.STRING,
					defaultValue: null,
					allowNull: true
				},
				repeat_timezone: {
					type: DataTypes.STRING,
					defaultValue: null,
					allowNull: true
				},
				last_run_at: {
					type: DataTypes.DATE(6),
					defaultValue: null,
					allowNull: true
				},
				repeat_interval: {
					type: DataTypes.STRING,
					defaultValue: null,
					allowNull: true
				},
				data: {
					type: DataTypes.JSON,
					defaultValue: null,
					allowNull: true
				},
				repeat_at: {
					type: DataTypes.STRING,
					defaultValue: null,
					allowNull: true
				},
				disabled: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: false
				},
				progress: {
					type: DataTypes.INTEGER,
					defaultValue: null,
					allowNull: true
				},
				last_modified_by: {
					type: DataTypes.STRING,
					defaultValue: null,
					allowNull: true
				},
				fork: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: false
				},
				version: {
					type: DataTypes.INTEGER,
					allowNull: false,
					defaultValue: 0
				}
			},
			{ transaction }
		);
		await transaction.commit();
	} catch (err) {
		await transaction.rollback();
		throw err;
	}
}

export async function down(queryInterface: QueryInterface): Promise<void> {
	const transaction = await queryInterface.sequelize.transaction();
	try {
		await queryInterface.dropTable('agenda_jobs', { transaction });
		await transaction.commit();
	} catch (err) {
		await transaction.rollback();
		throw err;
	}
}
