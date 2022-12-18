import * as debug from 'debug';
import { Agenda } from './index';
import type { Job, JobWithId } from './Job';
import type { ISqlConfig, ISqlConnection, ISqlOptions } from './types/DbOptions';
import { IJobParameters } from './types/JobParameters';
import { Sequelize, WhereOptions, InferAttributes, Op, Order } from 'sequelize';
import { initModel, JobModel } from './sequelize/models/job';
import { Umzug, SequelizeStorage } from 'umzug';
import * as path from 'path';

const log = debug('agenda:sql');

/**
 * @class
 */
export class JobSqlRepository {
    private sequelize: Sequelize;

    constructor(
		private agenda: Agenda,
		private connectOptions: (ISqlOptions | ISqlConnection) & ISqlConfig
	) {
		this.connectOptions.sort = this.connectOptions.sort || [
			['nextRunAt', 'ASC'],
			['priority', 'DESC'],
		];
		log('JobSqlRepository created');
	}

	private async migrate(): Promise<void> {
		const umzug = new Umzug({
			migrations: {
				glob: path.join(__dirname, './sequelize/migrations/*.js'),
				resolve: ({ name, path, context }) => {
					const migration = require(path || '');
					return {
						name,
						up: async () => migration.up(context, Sequelize),
					}
				},
			},
			context: this.sequelize.getQueryInterface(),
			storage: new SequelizeStorage({
				sequelize: this.sequelize,
				tableName: 'sequelize_meta',
			}),
			logger: undefined,
		});
		await umzug.up();
	}

	private async createConnection(): Promise<Sequelize> {
		const { connectOptions } = this;
		if (this.hasSqlConnection(connectOptions)) {
			log('create conenction:', 'has sql connection');
			await connectOptions.sequelize.authenticate();
			return connectOptions.sequelize;
		}

		if (this.hasSqlOptions(connectOptions)) {
			log('create conenction:', 'has sql options', connectOptions);
			let sequelize: Sequelize | undefined;
			if (connectOptions.db.options.dialect === 'sqlite') {
				sequelize = new Sequelize(connectOptions.db.options);
			} else if (connectOptions.db.address) {
				sequelize = new Sequelize(
					connectOptions.db.address,
					connectOptions.db.options,
				)
			}

			if (sequelize !== undefined) {
				log('create conenction:', 'authenticating sequelize');
				await sequelize.authenticate();
				return sequelize;
			}
		}

		throw new Error('invalid SQL database connection options');
	}

	private hasSqlConnection(connectOptions: unknown): connectOptions is ISqlConnection {
		return  !!(connectOptions as ISqlConnection)?.sequelize;
	}

	private hasSqlOptions(connectOptions: unknown): connectOptions is ISqlOptions {
		return !!(connectOptions as ISqlOptions)?.db?.options?.dialect;
	}

	async disconnect(): Promise<void> {
		await this.sequelize?.close();
	}

	async connect(): Promise<void> {
		log('connect:', 'creating connection');
		this.sequelize = await this.createConnection();

		if (
			this.connectOptions.enableMigration ||
			this.connectOptions.enableMigration === undefined
		) {
			log('connect:', 'migrating db');
			await this.migrate();
			// TODO: create index?
		}

		log('connect:', 'initialize sequelize model');
		initModel(this.sequelize);

		this.agenda.emit('ready');
	}

	async getJobById(id: string): Promise<IJobParameters | null> {
		const row = await JobModel.findByPk(id, { raw: true });
		if (row) {
			return row as IJobParameters;
		}
		return row;
	}

	async getJobs(
		query: WhereOptions<InferAttributes<JobModel>>,
		sort: Order = [],
		limit: number | undefined = undefined,
		skip: number | undefined = undefined
	): Promise<IJobParameters[]> {
		const jobs = await JobModel.findAll({
			raw: true,
			where: query,
			order: sort,
			limit,
			offset: skip,
		});
		return jobs as IJobParameters[];
	}

	async removeJobs(query: WhereOptions<InferAttributes<JobModel>>): Promise<number> {
		const result = await JobModel.destroy({
			where: query,
		});
		return result;
	}

	async getQueueSize(): Promise<number> {
		return JobModel.count({
			where: {
				nextRunAt: {
					[Op.lt]: new Date(),
				},
			},
		});
	}

	async unlockJob(job: Job): Promise<void> {
		// TODO: check if id always exist?
		await JobModel.update({
			lockedAt: null,
		}, {
			where: {
				_id: job.attrs._id as string,
				nextRunAt: {
					[Op.ne]: null,
				},
			},
			limit: 1,
		});
	}

	async unlockJobs(jobIds: string[]): Promise<void> {
		await JobModel.update({
			lockedAt: null
		}, {
			where: {
				_id: {
					[Op.in]: jobIds,
				},
				nextRunAt: {
					[Op.ne]: null,
				},
			}
		});
	}

	// test below
	async lockJob(job: JobWithId): Promise<IJobParameters | undefined> {
		// TODO: consider using transaction
		const row = await JobModel.findOne({
			where: {
				_id: job.attrs._id as string,
				name: job.attrs.name,
				lockedAt: {
					[Op.is]: null,
				},
				nextRunAt: job.attrs.nextRunAt, // TODO: anticipate null
				disabled: {
					[Op.ne]: true,
				},
			},
			order: this.connectOptions.sort,
		});

		if (row) {
			row.lockedAt = new Date();
			await row.save();
		}

		return row?.toJSON() as IJobParameters || undefined;
	}

	async getNextJobToRun(
		jobName: string,
		nextScanAt: Date,
		lockDeadline: Date,
		now: Date = new Date()
	): Promise<IJobParameters | undefined> {
		// TODO: consider using transaction
		const row = await JobModel.findOne({
			where: {
				name: jobName,
				disabled: {
					[Op.ne]: true,
				},
				[Op.or]: [
					{
						lockedAt: {
							[Op.is]: null,
						},
						nextRunAt: {
							[Op.lte]: nextScanAt,
						},
					},
					{
						lockedAt: {
							[Op.lte]: lockDeadline,
						},
					},
				],
			},
			order: this.connectOptions.sort,
		});
	
		if (row) {
			row.lockedAt = now;
			await row.save();
		}

		return row?.toJSON() as IJobParameters || undefined;
	}

	private processDbResult<DATA = unknown | void>(
		job: Job<DATA>,
		res?: IJobParameters<DATA>
	): Job<DATA> {
		log(
			'processDbResult() called with success, checking whether to process job immediately or not'
		);

		if (res) {
			job.attrs._id = res._id; // TODO: check if id always exist?
			job.attrs.nextRunAt = res.nextRunAt;

			this.agenda.emit('processJob', job);
		}

		return job;
	}

	async saveJobState(job: Job<any>): Promise<void> {
		// TODO: check if id always exist?
		const id = job.attrs._id as string;
		if (!id) {
			throw new Error(
				`job ${id} (name: ${job.attrs.name}) cannot be updated in the database, maybe it does not exist anymore?`
			);
		}
		const set = {
			lockedAt: (job.attrs.lockedAt && new Date(job.attrs.lockedAt)) || undefined,
			nextRunAt: (job.attrs.nextRunAt && new Date(job.attrs.nextRunAt)) || undefined,
			lastRunAt: (job.attrs.lastRunAt && new Date(job.attrs.lastRunAt)) || undefined,
			progress: job.attrs.progress,
			failReason: job.attrs.failReason,
			failCount: job.attrs.failCount,
			failedAt: job.attrs.failedAt && new Date(job.attrs.failedAt),
			lastFinishedAt: (job.attrs.lastFinishedAt && new Date(job.attrs.lastFinishedAt)) || undefined,
		};

		log('[job %s] save job state: \n%O', id, set);

		const result = await JobModel.update(set, {
			where: {
				_id: id,
				name: job.attrs.name,
			},
		});

		if (result[0] !== 1) {
			throw new Error(
				`job ${id} (name: ${job.attrs.name}) cannot be updated in the database, maybe it does not exist anymore?`
			);
		}
	}

	async saveJob<DATA = unknown | void>(job: Job<DATA>): Promise<Job<DATA>> {
		try {
			log('attempting to save a job');

			const id = job.attrs._id as string;

			const { _id, unique, uniqueOpts, ...props } = {
				...job.toJson(),
				lastModifiedBy: this.agenda.attrs.name,
			};

			log('[job %s] set job props: \n%O', id, props);


			const now = new Date();

			if (id) {
				// TODO: consider using transaction
				const row = await JobModel.findOne({
					where: {
						_id: id,
						name: props.name,
					},
				});
				if (row) {
					row.set(props);
					await row.save();
				}
				return this.processDbResult(job, row?.toJSON() as IJobParameters<DATA>);
			}

			if (props.type === 'single') {
				log('job with type of "single" found');
				// TODO: consider using transaction
				let row = await JobModel.findOne({
					where: {
						name: props.name,
						type: 'single',
					},
				});

				if (row) {
					if (props.nextRunAt && props.nextRunAt <= now) {
						log('job has a scheduled nextRunAt time, protecting that field from upsert');
						delete (props as Partial<IJobParameters>).nextRunAt;
					}
					row.set(props);
					await row.save();
				} else {
					row = await JobModel.create(props);
				}

				return this.processDbResult(job, row?.toJSON() as IJobParameters<DATA>);
			}

			if (job.attrs.unique) {
				const query = job.attrs.unique as  WhereOptions<InferAttributes<JobModel>>;
				// TODO: consider using transaction
				let row = await JobModel.findOne({
					where: {
						...query,
						name: props.name,
					},
				});

				if (row && !job.attrs.uniqueOpts?.insertOnly) {
					row.set(props);
					await row.save();
				} else if (!row) {
					row = await JobModel.create(props);
				}
	
				return this.processDbResult(job, row?.toJSON() as IJobParameters<DATA>);
			}

			log(
				'using default behavior, inserting new job via create() with props that were set: \n%O',
				props
			);
			const row = await JobModel.create(props);
			return this.processDbResult(job, {
				_id: row._id,
				...props,
			} as IJobParameters<DATA>);
		} catch (error) {
			log('processDbResult() received an error, job was not updated/created');
			throw error;
		}
	}
}
