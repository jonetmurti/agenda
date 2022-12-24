import {
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	Sequelize,
	DataTypes
} from 'sequelize';

export class JobModel extends Model<InferAttributes<JobModel>, InferCreationAttributes<JobModel>> {
	declare _id: CreationOptional<string>; // default uuid

	declare name: string;

	declare priority: number;

	declare nextRunAt: Date | null | undefined;

	declare type: 'normal' | 'single';

	declare lockedAt: Date | null | undefined;

	declare lastFinishedAt: Date | null | undefined;

	declare failedAt: Date | null | undefined;

	declare failCount: number | null | undefined;

	declare failReason: string | null | undefined;

	declare repeatTimezone: string | null | undefined;

	declare lastRunAt: Date | null | undefined;

	declare repeatInterval: string | number | null | undefined;

	declare data: unknown | void;

	declare repeatAt: string | null | undefined;

	declare disabled: CreationOptional<boolean>;

	declare progress: number | null | undefined; // default 0 ?? dipake dimana

	declare lastModifiedBy: string | null | undefined;

	declare fork: CreationOptional<boolean>; // default false
}

export function initModel(sequelize: Sequelize): void {
	JobModel.init(
		{
			_id: {
				primaryKey: true,
				field: '_id',
				defaultValue: DataTypes.UUIDV4,
				type: DataTypes.UUID,
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
			nextRunAt: {
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
			lockedAt: {
				type: DataTypes.DATE(6),
				defaultValue: null,
				allowNull: true
			},
			lastFinishedAt: {
				type: DataTypes.DATE(6),
				defaultValue: null,
				allowNull: true
			},
			failedAt: {
				type: DataTypes.DATE(6),
				defaultValue: null,
				allowNull: true
			},
			failCount: {
				type: DataTypes.INTEGER,
				defaultValue: null,
				allowNull: true
			},
			failReason: {
				type: DataTypes.STRING,
				defaultValue: null,
				allowNull: true
			},
			repeatTimezone: {
				type: DataTypes.STRING,
				defaultValue: null,
				allowNull: true
			},
			lastRunAt: {
				type: DataTypes.DATE(6),
				defaultValue: null,
				allowNull: true
			},
			repeatInterval: {
				type: DataTypes.STRING,
				defaultValue: null,
				allowNull: true
			},
			data: {
				type: DataTypes.JSON,
				defaultValue: null,
				allowNull: true
			},
			repeatAt: {
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
			lastModifiedBy: {
				type: DataTypes.STRING,
				defaultValue: null,
				allowNull: true
			},
			fork: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: 'Job',
			tableName: 'agenda_jobs',
			timestamps: false,
			underscored: true,
			version: true
		}
	);
}
