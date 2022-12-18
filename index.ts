import { Sequelize, WhereOptions, InferAttributes } from 'sequelize';
import { Agenda, JobDbRepository, JobSqlRepository, Job, JobWithId } from './src';
import * as debug from 'debug';
import { Filter } from 'mongodb';
import { IJobParameters } from './src';
import { JobModel } from './src/sequelize/models/job';

debug.enable('agenda:sql');

const createJobs = async (
    params: IJobParameters<unknown | void>[],
    agenda: Agenda,
    jobRepository: JobDbRepository | JobSqlRepository,
    nextRunAt: Date = new Date()
) => {
    for (const param of params) {
        const job = new Job(agenda, param);
        jobRepository.saveJob(job);
    }
}

(async () => {
    try {
        const agenda = new Agenda();

        const mongoRepository = new JobDbRepository(
            agenda,
            {
                db: {
                    address: 'localhost:27017/agenda-test',
                    collection: 'agendaJobs',
                }
            }
        );
        
        const sqlRepository = new JobSqlRepository(
            agenda,
            {
                db: {
                    address: 'postgres://postgres:postgres@localhost:5432/agenda_db',
                    options: {
                        dialect: 'postgres',
                        logging: false,
                    }
                },
                enableMigration: true,
            }
        );

        await mongoRepository.connect();
        await sqlRepository.connect();

        // const now = new Date();
        // await createJobs([
        //     {
        //         name: 'normalDiffPrio',
        //         type: 'normal',
        //         priority: 7,
        //         nextRunAt: now,
        //         data: { message: 'hello, there!' }
        //     },
        //     {
        //         name: 'normalDiffPrio',
        //         type: 'normal',
        //         priority: 5,
        //         nextRunAt: now,
        //         data: { message: 'hello, there!' }
        //     },
        // ], agenda, mongoRepository, now);
        // await createJobs([
        //     {
        //         name: 'normalDiffPrio',
        //         type: 'normal',
        //         priority: 7,
        //         nextRunAt: now,
        //         data: { message: 'hello, there!' }
        //     },
        //     {
        //         name: 'normalDiffPrio',
        //         type: 'normal',
        //         priority: 5,
        //         nextRunAt: now,
        //         data: { message: 'hello, there!' }
        //     },
        // ], agenda, sqlRepository, now);

        /** TEST SAVE JOB */

        /** type: normal */
        // const now = new Date();
        // const sqlNormalJobIn = new Job(
        //     agenda,
        //     {
        //         name: 'normalJob',
        //         type: 'normal',
        //         priority: 7,
        //         nextRunAt: now,
        //         data: { message: 'hello, world!' },
        //     }
        // );
        // const mongoNormalJobIn = new Job(
        //     agenda,
        //     {
        //         name: 'normalJob',
        //         type: 'normal',
        //         priority: 5,
        //         nextRunAt: now,
        //         data: { message: 'hello, world!' },
        //     }
        // );

        // const mongoNormalJobOut = await mongoRepository.saveJob(mongoNormalJobIn);
        // const sqlNormalJobOut = await sqlRepository.saveJob(sqlNormalJobIn);

        // console.log('mongo normal job', mongoNormalJobOut.attrs);
        // console.log('sql normal job', sqlNormalJobOut.attrs);

        /** type: single */
        // const fiveHoursLater = new Date();
        // fiveHoursLater.setTime(fiveHoursLater.getTime() + 5 * 60 * 60 * 1000);
        // const sqlSingleJobIn = new Job(
        //     agenda,
        //     {
        //         name: 'singleJobNewNext',
        //         type: 'single',
        //         priority: 3,
        //         data: { message: 'hello, world!' },
        //         nextRunAt: fiveHoursLater,
        //     }
        // );
        // const mongoSingleJobIn = new Job(
        //     agenda,
        //     {
        //         name: 'singleJobNewNext',
        //         type: 'single',
        //         priority: 3,
        //         data: { message: 'hello, world!' },
        //         nextRunAt: fiveHoursLater,
        //     }
        // );

        // const mongoSingleJobOut = await mongoRepository.saveJob(mongoSingleJobIn);
        // const sqlSingleJobOut = await sqlRepository.saveJob(sqlSingleJobIn);

        // console.log('mongo normal job', mongoSingleJobOut.attrs);
        // console.log('sql normal job', sqlSingleJobOut.attrs);

        /** type: unique */
        // const sqlUniqueJobIn = new Job(
        //     agenda,
        //     {
        //         name: 'uniqueJob',
        //         type: 'normal',
        //         priority: 4,
        //         data: { message: 'hello, world!' },
        //         unique: {
                    
        //         } as WhereOptions<InferAttributes<JobModel>>,
        //         uniqueOpts: {
        //             insertOnly: true,
        //         },
        //     }
        // );
        // const mongoUniqueJobIn = new Job(
        //     agenda,
        //     {
        //         name: 'uniqueJob',
        //         type: 'normal',
        //         priority: 4,
        //         data: { message: 'hello, world!' },
        //         unique: {
                    
        //         } as Filter<Omit<IJobParameters<unknown | void>, 'unique'>>,
        //         uniqueOpts: {
        //             insertOnly: true,
        //         },
        //     }
        // );

        // const mongoUniqueJobOut = await mongoRepository.saveJob(mongoUniqueJobIn);
        // const sqlUniqueJobOut = await sqlRepository.saveJob(sqlUniqueJobIn);

        // console.log('mongo normal job', mongoUniqueJobOut.attrs);
        // console.log('sql normal job', sqlUniqueJobOut.attrs);

        /** type: with id */
        // const normalSqlJobAttr = await sqlRepository.getJobById('4bf37fff-39f0-41db-807c-ebdced34a42c');
        // const normalMongoJobAttr = await mongoRepository.getJobById('639eb8caef7481b3e925f040');

        // if (normalSqlJobAttr && normalMongoJobAttr) {
        //     console.log('job found');
        //     const sqlNormalJobIn = new Job(agenda, normalSqlJobAttr);
        //     sqlNormalJobIn.attrs.data = { message: 'huha!' };
        //     sqlNormalJobIn.attrs.priority = 1;
        //     const mongoNormalJobIn = new Job(agenda, normalMongoJobAttr);
        //     mongoNormalJobIn.attrs.data = { message: 'huha!' };
        //     mongoNormalJobIn.attrs.priority = 1;
    
        //     const sqlNormalJobOut = await sqlRepository.saveJob(sqlNormalJobIn);
        //     const mongoNormalJobOut = await mongoRepository.saveJob(mongoNormalJobIn);

        //     console.log('mongo normal job', mongoNormalJobOut.attrs);
        //     console.log('sql normal job', sqlNormalJobOut.attrs);
        // }

        /** TEST SAVE JOB STATE */

        /** job with id */
        // const normalSqlJobAttr = await sqlRepository.getJobById('4bf37fff-39f0-41db-807c-ebdced34a42c');
        // const normalMongoJobAttr = await mongoRepository.getJobById('639eb8caef7481b3e925f040');
    
        // if (normalSqlJobAttr && normalMongoJobAttr) {
        //     console.log('job found');
        //     const sqlNormalJobIn = new Job(agenda, normalSqlJobAttr);
        //     sqlNormalJobIn.attrs.data = { message: 'hello man horse!' };
        //     sqlNormalJobIn.attrs.priority = 0;
        //     sqlNormalJobIn.attrs.nextRunAt = new Date();
        //     const mongoNormalJobIn = new Job(agenda, normalMongoJobAttr);
        //     mongoNormalJobIn.attrs.data = { message: 'hello man horse!' };
        //     mongoNormalJobIn.attrs.priority = 0;
        //     mongoNormalJobIn.attrs.nextRunAt = new Date();
    
        //     await sqlRepository.saveJobState(sqlNormalJobIn);
        //     await mongoRepository.saveJobState(mongoNormalJobIn);
        // }

        /** job without id */
        // const normalSqlJobAttr = await sqlRepository.getJobById('4bf37fff-39f0-41db-807c-ebdced34a42c');
        // const normalMongoJobAttr = await mongoRepository.getJobById('639eb8caef7481b3e925f040');
    
        // if (normalSqlJobAttr && normalMongoJobAttr) {
        //     console.log('job found');
        //     const sqlNormalJobIn = new Job(agenda, normalSqlJobAttr);
        //     sqlNormalJobIn.attrs._id = undefined;
        //     const mongoNormalJobIn = new Job(agenda, normalMongoJobAttr);
        //     mongoNormalJobIn.attrs._id = undefined;
    
        //     await sqlRepository.saveJobState(sqlNormalJobIn);
        //     await mongoRepository.saveJobState(mongoNormalJobIn);
        // }

        /** TEST GET NEXT JOB TO RUN */
    
        /** test locked at null and next run < next scan */
        // const sqlNextJob = await sqlRepository.getNextJobToRun(
        //     'normalDiffPrio',
        //     new Date(Date.now().valueOf() + 5000),
        //     new Date(Date.now().valueOf() - 1 * 60 * 1000),
        // );
        // const mongoNextJob = await mongoRepository.getNextJobToRun(
        //     'normalDiffPrio',
        //     new Date(Date.now().valueOf() + 5000),
        //     new Date(Date.now().valueOf() - 1 * 60 * 1000),
        // );

        // console.log('sql next job:', sqlNextJob);
        // console.log('mongo next job:', mongoNextJob);

        /** test locked at < lock deadline */
        // const sqlNextJob = await sqlRepository.getNextJobToRun(
        //     'normalJob',
        //     new Date(Date.now().valueOf() + 5000),
        //     new Date(Date.now().valueOf() - 1 * 60 * 1000),
        // );
        // const mongoNextJob = await mongoRepository.getNextJobToRun(
        //     'normalJob',
        //     new Date(Date.now().valueOf() + 5000),
        //     new Date(Date.now().valueOf() - 1 * 60 * 1000),
        // );

        // console.log('sql next job:', sqlNextJob);
        // console.log('mongo next job:', mongoNextJob);

        /** test job not found */
        // const sqlNextJob = await sqlRepository.getNextJobToRun(
        //     'OHALO',
        //     new Date(Date.now().valueOf() + 5000),
        //     new Date(Date.now().valueOf() - 1 * 60 * 1000),
        // );
        // const mongoNextJob = await mongoRepository.getNextJobToRun(
        //     'OHALO',
        //     new Date(Date.now().valueOf() + 5000),
        //     new Date(Date.now().valueOf() - 1 * 60 * 1000),
        // );

        // console.log('sql next job:', sqlNextJob);
        // console.log('mongo next job:', mongoNextJob);

        /** TEST LOCK JOBS */

        /** test lock job with right condition */
        // const normalSqlJobAttr = await sqlRepository.getJobById('8a80fae3-1790-4a04-b9f3-445ef076395b');
        // const normalMongoJobAttr = await mongoRepository.getJobById('639f125e7b60bd696c75543b');

        // if (normalSqlJobAttr && normalMongoJobAttr) {
        //     const sqlJob = new Job(agenda, normalSqlJobAttr);
        //     const lockedSqlJob = await sqlRepository.lockJob(sqlJob as JobWithId);
        //     const mongoJob = new Job(agenda, normalMongoJobAttr);
        //     const lockedMongoJob = await mongoRepository.lockJob(mongoJob as JobWithId);

        //     console.log('locked SQL:', lockedSqlJob);
        //     console.log('locked MONGO:', lockedMongoJob);
        // }

        /** test lock job with wrong condition */
    } catch (err) {
        console.error(err);
    }
})();
