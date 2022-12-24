/* eslint-disable no-console */
import * as delay from 'delay';
import { Agenda } from '../src';
import type { Sequelize } from 'sequelize';
import { JobModel } from '../src/sequelize/models/job';
import { mockSql } from './helpers/mock-sql';

// Create agenda instances
let agenda: Agenda;
// SQL connection
let sequelize: Sequelize;

const clearJobs = async (): Promise<void> => {
	if (sequelize) {
		await JobModel.destroy({
			where: {}
		});
	}
};

const jobType = 'do work';
const jobProcessor = () => { };

describe('Retry', () => {
	beforeEach(async () => {
		if (!sequelize) {
			const mockedSql = await mockSql();
			sequelize = mockedSql.sequelize;
		}

		return new Promise(resolve => {
			agenda = new Agenda(
				{
					sequelize
				},
				async () => {
					await delay(50);
					await clearJobs();
					agenda.define('someJob', jobProcessor);
					agenda.define('send email', jobProcessor);
					agenda.define('some job', jobProcessor);
					agenda.define(jobType, jobProcessor);
					return resolve();
				}
			);
		});
	});

	afterEach(async () => {
		await delay(50);
		await agenda.stop();
		await clearJobs();
		// await mongoClient.disconnect();
		// await jobs._db.close();
	});

	it('should retry a job', async () => {
		let shouldFail = true;

		agenda.processEvery(100); // Shave 5s off test runtime :grin:
		agenda.define('a job', (_job, done) => {
			if (shouldFail) {
				shouldFail = false;
				return done(new Error('test failure'));
			}

			done();
			return undefined;
		});

		agenda.on('fail:a job', (err, job) => {
			if (err) {
				// Do nothing as this is expected to fail.
			}

			job.schedule('now').save();
		});

		const successPromise = new Promise(resolve => {
			agenda.on('success:a job', resolve)
		});

		await agenda.now('a job');

		await agenda.start();
		await successPromise;
	}).timeout(100000);
});
