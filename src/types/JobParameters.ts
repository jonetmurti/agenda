import { WhereOptions, InferAttributes } from 'sequelize';
import { JobModel } from '../sequelize/models/job';

export interface IJobParameters<DATA = unknown | void> {
	_id?: string;

	name: string;
	priority: number;
	nextRunAt: Date | null;
	/**
	 * normal: job is queued and will be processed (regular case when the user adds a new job)
	 * single: job with this name is only queued once, if there is an exisitn gentry in the database, the job is just updated, but not newly inserted (this is used for .every())
	 */
	type: 'normal' | 'single';

	lockedAt?: Date;
	lastFinishedAt?: Date;
	failedAt?: Date;
	failCount?: number;
	failReason?: string;
	repeatTimezone?: string;
	lastRunAt?: Date;
	repeatInterval?: string | number;
	data: DATA;
	repeatAt?: string;
	disabled?: boolean;
	progress?: number;

	// unique query object
	unique?: WhereOptions<InferAttributes<JobModel>>;
	uniqueOpts?: {
		insertOnly: boolean;
	};

	lastModifiedBy?: string;

	/** forks a new node sub process for executing this job */
	fork?: boolean;
}

export type TJobDatefield = keyof Pick<
	IJobParameters,
	'lastRunAt' | 'lastFinishedAt' | 'nextRunAt' | 'failedAt' | 'lockedAt'
>;

export const datefields: Array<TJobDatefield> = [
	'lastRunAt',
	'lastFinishedAt',
	'nextRunAt',
	'failedAt',
	'lockedAt'
];
