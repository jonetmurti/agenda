# Agenda-SQL

<p align="center">
  A light-weight job scheduling library for Node.js
</p>

Agenda-SQL is a fork of agenda.js v5.0.0,
it differs from the original version in following points:

- Uses SQL as its persistence layer using Sequelize as its ORM
- It is currently tested on PostgreSQL (12, 13, 14, 15) and MySQL (5.7, 8)

### Feature Comparison

Since there are a few job queue solutions, here a table comparing them to help you use the one that
better suits your needs.

| Feature                    |      Bull       |   Bee    | Agenda-SQL |
| :------------------------- | :-------------: | :------: | :--------: |
| Backend                    |      redis      |  redis   |     SQL    |
| Priorities                 |        ✓        |          |      ✓     |
| Concurrency                |        ✓        |    ✓     |      ✓     |
| Delayed jobs               |        ✓        |          |      ✓     |
| Global events              |        ✓        |          |      ✓     |
| Rate Limiter               |        ✓        |          |  	       |
| Pause/Resume               |        ✓        |          |   	 ✓     |
| Sandboxed worker           |        ✓        |          |   	 ✓     |
| Repeatable jobs            |        ✓        |          |   	 ✓     |
| Atomic ops                 |        ✓        |    ✓     |   	 ~     |
| Persistence                |        ✓        |    ✓     |   	 ✓     |
| UI                         |        ✓        |          |   	 ✓     |
| REST API                   |                 |          |   	 ✓     |
| Central (Scalable) Queue   |                 |          |   	 ✓     |
| Supports long running jobs |                 |          |   	 ✓     |
| Optimized for              | Jobs / Messages | Messages |    Jobs    |

_Kudos for making the comparison chart goes to [Bull](https://www.npmjs.com/package/bull#feature-comparison) maintainers._

# Installation

Install via NPM

    npm install @hokify/agenda

You will also need a working SQL database (MySQL or PostgreSQL).

# Example Usage

```js
const sqlAddress = 'postgres://postgres:postgres@localhost:5432/agenda_db';

const agenda = new Agenda(
	{
		db: {
			address: sqlAddress,
			options: {
				dialect: 'postgres',
				logging: false
			}
		}
	}
);

agenda.define('delete old users', async job => {
	// Implement job handler here
});

(async function () {
	// IIFE to give access to async/await
	await agenda.start();

	await agenda.every('3 minutes', 'delete old users');

	// Alternatively, you could also do:
	await agenda.every('*/3 * * * *', 'delete old users');
})();
```

```js
agenda.define(
	'send email report',
	async job => {
		const { to } = job.attrs.data;
		await emailClient.send({
			to,
			from: 'example@example.com',
			subject: 'Email Report',
			body: '...'
		});
	},
	{ priority: 'high', concurrency: 10 }
);

(async function () {
	await agenda.start();
	await agenda.schedule('in 20 minutes', 'send email report', { to: 'admin@example.com' });
})();
```

```js
(async function () {
	const weeklyReport = agenda.create('send email report', { to: 'example@example.com' });
	await agenda.start();
	await weeklyReport.repeatEvery('1 week').save();
})();
```

# Full documentation

Agenda's basic control structure is an instance of an agenda. Agenda's are
mapped to a database and load the jobs from within.

## Table of Contents

- [Configuring an agenda](#configuring-an-agenda)
- [Agenda Events](#agenda-events)
- [Defining job processors](#defining-job-processors)
- [Creating jobs](#creating-jobs)
- [Managing jobs](#managing-jobs)
- [Starting the job processor](#starting-the-job-processor)
- [Multiple job processors](#multiple-job-processors)
- [Manually working with jobs](#manually-working-with-a-job)
- [Job Queue Events](#job-queue-events)
- [Frequently asked questions](#frequently-asked-questions)
- [Example Project structure](#example-project-structure)
- [Known Issues](#known-issues)
- [Debugging Issues](#debugging-issues)
- [Acknowledgements](#acknowledgements)

## Configuring an agenda

All configuration methods are chainable, meaning you can do something like:

```js
const agenda = new Agenda();
agenda
  .database(...)
  .processEvery('3 minutes')
  ...;
```

Possible agenda config options:

```ts
{
	name: string;
	defaultConcurrency: number;
	processEvery: number;
	maxConcurrency: number;
	defaultLockLimit: number;
	lockLimit: number;
	defaultLockLifetime: number;
	ensureIndex: boolean;
	enableMigration: boolean;
	sort: Order;
	db: {
		address: string;
		options: Options;
	}
	sequelize: Sequelize;
}
```

Agenda uses [Human Interval](http://github.com/rschmukler/human-interval) for specifying the intervals. It supports the following units:

`seconds`, `minutes`, `hours`, `days`,`weeks`, `months` -- assumes 30 days, `years` -- assumes 365 days

More sophisticated examples

```js
agenda.processEvery('one minute');
agenda.processEvery('1.5 minutes');
agenda.processEvery('3 days and 4 hours');
agenda.processEvery('3 days, 4 hours and 36 seconds');
```

### database(url, Options)

Specifies the database at the `url` specified.

```js
agenda.database('postgres://postgres:postgres@localhost:5432/agenda_db', { dialect: 'postgres' });
```

You can also specify it during instantiation.

```js
const sqlAddress = 'postgres://postgres:postgres@localhost:5432/agenda_db';

const agenda = new Agenda(
	{
		db: {
			address: sqlAddress,
			options: {
				dialect: 'postgres'
			}
		}
	}
);
```

Agenda will emit a `ready` event (see [Agenda Events](#agenda-events)) when properly connected to the database.
It is safe to call `agenda.start()` without waiting for this event, as this is handled internally.
If you're using the `db` options, or call `database`, then you may still need to listen for `ready` before saving jobs.

### sql(sequelizeInstance)

Use an existing Sequelize instance. This can help consolidate connections to a
database. You can instead use `.database` to have agenda handle connecting for you.

You can also specify it during instantiation:

```js
const agenda = new Agenda({ sequelize: sequelizeInstance });
```

### name(name)

Sets the `lastModifiedBy` field to `name` in the jobs collection.
Useful if you have multiple job processors (agendas) and want to see which
job queue last ran the job.

```js
agenda.name(os.hostname + '-' + process.pid);
```

You can also specify it during instantiation

```js
const agenda = new Agenda({ name: 'test queue' });
```

### processEvery(interval)

Takes a string `interval` which can be either a traditional javascript number,
or a string such as `3 minutes`

Specifies the frequency at which agenda will query the database looking for jobs
that need to be processed. Agenda internally uses `setTimeout` to guarantee that
jobs run at (close to ~3ms) the right time.

Decreasing the frequency will result in fewer database queries, but more jobs
being stored in memory.

Also worth noting is that if the job queue is shutdown, any jobs stored in memory
that haven't run will still be locked, meaning that you may have to wait for the
lock to expire. By default, processInterval is `'5 seconds'`.

```js
agenda.processEvery('1 minute');
```

You can also specify it during instantiation

```js
const agenda = new Agenda({ processEvery: '30 seconds' });
```

### maxConcurrency(number)

Takes a `number` which specifies the max number of jobs that can be running at
any given moment. By default it is `20`.

```js
agenda.maxConcurrency(20);
```

You can also specify it during instantiation

```js
const agenda = new Agenda({ maxConcurrency: 20 });
```

### defaultConcurrency(number)

Takes a `number` which specifies the default number of a specific job that can be running at
any given moment. By default it is `5`.

```js
agenda.defaultConcurrency(5);
```

You can also specify it during instantiation

```js
const agenda = new Agenda({ defaultConcurrency: 5 });
```

### lockLimit(number)

Takes a `number` which specifies the max number jobs that can be locked at any given moment. By default it is `0` for no max.

```js
agenda.lockLimit(0);
```

You can also specify it during instantiation

```js
const agenda = new Agenda({ lockLimit: 0 });
```

### defaultLockLimit(number)

Takes a `number` which specifies the default number of a specific job that can be locked at any given moment. By default it is `0` for no max.

```js
agenda.defaultLockLimit(0);
```

You can also specify it during instantiation

```js
const agenda = new Agenda({ defaultLockLimit: 0 });
```

### defaultLockLifetime(number)

Takes a `number` which specifies the default lock lifetime in milliseconds. By
default it is 10 minutes. This can be overridden by specifying the
`lockLifetime` option to a defined job.

A job will unlock if it is finished (ie. the returned Promise resolves/rejects
or `done` is specified in the params and `done()` is called) before the
`lockLifetime`. The lock is useful if the job crashes or times out.

```js
agenda.defaultLockLifetime(10000);
```

You can also specify it during instantiation

```js
const agenda = new Agenda({ defaultLockLifetime: 10000 });
```

### sort(query)

Takes a `query` which specifies the sort query to be used for finding and locking the next job.

By default it is `[['nextRunAt', 'ASC'], ['priority', 'DESC']]`, which obeys a first in first out approach, with respect to priority.

## Agenda Events

An instance of an agenda will emit the following events:

- `ready` - called when Agenda database connection is successfully opened and indices created.
  If you're passing agenda an existing connection, you shouldn't need to listen for this, as `agenda.start()` will not resolve until indices have been created.
  If you're using the `db` options, or call `database`, then you may still need to listen for the `ready` event before saving jobs. `agenda.start()` will still wait for the connection to be opened.
- `error` - called when Agenda database connection process has thrown an error

```js
await agenda.start();
```

## Defining Job Processors

Before you can use a job, you must define its processing behavior.

### define(jobName, fn, [options])

Defines a job with the name of `jobName`. When a job of `jobName` gets run, it
will be passed to `fn(job, done)`. To maintain asynchronous behavior, you may
either provide a Promise-returning function in `fn` _or_ provide `done` as a
second parameter to `fn`. If `done` is specified in the function signature, you
must call `done()` when you are processing the job. If your function is
synchronous or returns a Promise, you may omit `done` from the signature.

`options` is an optional argument which can overwrite the defaults. It can take
the following:

- `concurrency`: `number` maximum number of that job that can be running at once (per instance of agenda)
- `lockLimit`: `number` maximum number of that job that can be locked at once (per instance of agenda)
- `lockLifetime`: `number` interval in ms of how long the job stays locked for (see [multiple job processors](#multiple-job-processors) for more info).
  A job will automatically unlock once a returned promise resolves/rejects (or if `done` is specified in the signature and `done()` is called).
- `priority`: `(lowest|low|normal|high|highest|number)` specifies the priority
  of the job. Higher priority jobs will run first. See the priority mapping
  below
- `shouldSaveResult`: `boolean` flag that specifies whether the result of the job should also be stored in the database. Defaults to false

Priority mapping:

```
{
  highest: 20,
  high: 10,
  normal: 0,
  low: -10,
  lowest: -20
}
```

Async Job:

```js
agenda.define('some long running job', async job => {
	const data = await doSomelengthyTask();
	await formatThatData(data);
	await sendThatData(data);
});
```

Async Job (using `done`):

```js
agenda.define('some long running job', (job, done) => {
	doSomelengthyTask(data => {
		formatThatData(data);
		sendThatData(data);
		done();
	});
});
```

Sync Job:

```js
agenda.define('say hello', job => {
	console.log('Hello!');
});
```

`define()` acts like an assignment: if `define(jobName, ...)` is called multiple times (e.g. every time your script starts), the definition in the last call will overwrite the previous one. Thus, if you `define` the `jobName` only once in your code, it's safe for that call to execute multiple times.

## Creating Jobs

### every(interval, name, [data], [options])

Runs job `name` at the given `interval`. Optionally, data and options can be passed in.
Every creates a job of type `single`, which means that it will only create one
job in the database, even if that line is run multiple times. This lets you put
it in a file that may get run multiple times, such as `webserver.js` which may
reboot from time to time.

`interval` can be a human-readable format `String`, a [cron format](https://www.npmjs.com/package/cron-parser) `String`, or a `Number`.

`data` is an optional argument that will be passed to the processing function
under `job.attrs.data`.

`options` is an optional argument that will be passed to [`job.repeatEvery`](#repeateveryinterval-options).
In order to use this argument, `data` must also be specified.

Returns the `job`.

```js
agenda.define('printAnalyticsReport', async job => {
	const users = await User.doSomethingReallyIntensive();
	processUserData(users);
	console.log('I print a report!');
});

agenda.every('15 minutes', 'printAnalyticsReport');
```

Optionally, `name` could be array of job names, which is convenient for scheduling
different jobs for same `interval`.

```js
agenda.every('15 minutes', ['printAnalyticsReport', 'sendNotifications', 'updateUserRecords']);
```

In this case, `every` returns array of `jobs`.

### schedule(when, name, [data])

Schedules a job to run `name` once at a given time. `when` can be a `Date` or a
`String` such as `tomorrow at 5pm`.

`data` is an optional argument that will be passed to the processing function
under `job.attrs.data`.

Returns the `job`.

```js
agenda.schedule('tomorrow at noon', 'printAnalyticsReport', { userCount: 100 });
```

Optionally, `name` could be array of job names, similar to the `every` method.

```js
agenda.schedule('tomorrow at noon', [
	'printAnalyticsReport',
	'sendNotifications',
	'updateUserRecords'
]);
```

In this case, `schedule` returns array of `jobs`.

### now(name, [data])

Schedules a job to run `name` once immediately.

`data` is an optional argument that will be passed to the processing function
under `job.attrs.data`.

Returns the `job`.

```js
agenda.now('do the hokey pokey');
```

### create(jobName, data)

Returns an instance of a `jobName` with `data`. This does _NOT_ save the job in
the database. See below to learn how to manually work with jobs.

```js
const job = agenda.create('printAnalyticsReport', { userCount: 100 });
await job.save();
console.log('Job successfully saved');
```

## Managing Jobs

### jobs(query, sort, limit, skip)

Lets you query (then sort, limit and skip the result) all of the jobs in the agenda job's database. For more information about Sequelize, `query`, `order`/`sort`, `limit`, and `offset`/`skip`, see [Sequelize queries](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/).

```js
const jobs = await agenda.jobs({ name: 'printAnalyticsReport' }, { data: -1 }, 3, 1);
// Work with jobs (see below)
```

### cancel(query)

Cancels any jobs matching the passed sequelize "where" query, and removes them from the database. Returns a Promise resolving to the number of cancelled jobs, or rejecting on error.

```js
const numRemoved = await agenda.cancel({ name: 'printAnalyticsReport' });
```

This functionality can also be achieved by first retrieving all the jobs from the database using `agenda.jobs()`, looping through the resulting array and calling `job.remove()` on each. It is however preferable to use `agenda.cancel()` for this use case, as this ensures the operation is atomic.

### disable(query)

Disables any jobs matching the passed sequelize "where" query, preventing any matching jobs from being run by the Job Processor.

```js
const numDisabled = await agenda.disable({ name: 'pollExternalService' });
```

Similar to `agenda.cancel()`, this functionality can be acheived with a combination of `agenda.jobs()` and `job.disable()`

### enable(query)

Enables any jobs matching the passed sequelize "where" query, allowing any matching jobs to be run by the Job Processor.

```js
const numEnabled = await agenda.enable({ name: 'pollExternalService' });
```

Similar to `agenda.cancel()`, this functionality can be acheived with a combination of `agenda.jobs()` and `job.enable()`

### purge()

Removes all jobs in the database without defined behaviors. Useful if you change a definition name and want to remove old jobs. Returns a Promise resolving to the number of removed jobs, or rejecting on error.

_IMPORTANT:_ Do not run this before you finish defining all of your jobs. If you do, you will nuke your database of jobs.

```js
const numRemoved = await agenda.purge();
```

## Starting the job processor

To get agenda to start processing jobs from the database you must start it. This
will schedule an interval (based on `processEvery`) to check for new jobs and
run them. You can also stop the queue.

### start

Starts the job queue processing, checking [`processEvery`](#processeveryinterval) time to see if there
are new jobs. Must be called _after_ `processEvery`, and _before_ any job scheduling (e.g. `every`).

### stop

Stops the job queue processing. Unlocks currently running jobs.

This can be very useful for graceful shutdowns so that currently running/grabbed jobs are abandoned so that other
job queues can grab them / they are unlocked should the job queue start again. Here is an example of how to do a graceful
shutdown.

```js
async function graceful() {
	await agenda.stop();
	process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
```

## Multiple job processors

Sometimes you may want to have multiple node instances / machines process from
the same queue. Agenda supports a locking mechanism to ensure that multiple
queues don't process the same job.

You can configure the locking mechanism by specifying `lockLifetime` as an
interval when defining the job.

```js
agenda.define(
	'someJob',
	(job, cb) => {
		// Do something in 10 seconds or less...
	},
	{ lockLifetime: 10000 }
);
```

This will ensure that no other job processor (this one included) attempts to run the job again
for the next 10 seconds. If you have a particularly long running job, you will want to
specify a longer lockLifetime.

By default it is 10 minutes. Typically you shouldn't have a job that runs for 10 minutes,
so this is really insurance should the job queue crash before the job is unlocked.

When a job is finished (i.e. the returned promise resolves/rejects or `done` is
specified in the signature and `done()` is called), it will automatically unlock.

## Manually working with a job

A job instance has many instance methods. All mutating methods must be followed
with a call to `await job.save()` in order to persist the changes to the database.

### repeatEvery(interval, [options])

Specifies an `interval` on which the job should repeat. The job runs at the time of defining as well in configured intervals, that is "run _now_ and in intervals".

`interval` can be a human-readable format `String`, a [cron format](https://www.npmjs.com/package/cron-parser) `String`, or a `Number`.

`options` is an optional argument containing:

`options.timezone`: should be a string as accepted by [moment-timezone](https://momentjs.com/timezone/) and is considered when using an interval in the cron string format.

`options.skipImmediate`: `true` | `false` (default) Setting this `true` will skip the immediate run. The first run will occur only in configured interval.

`options.startDate`: `Date` the first time the job runs, should be equal or after the start date.

`options.endDate`: `Date` the job should not repeat after the endDate. The job can run on the end-date itself, but not after that.

`options.skipDays`: `human readable string` ('2 days'). After each run, it will skip the duration of 'skipDays'

```js
job.repeatEvery('10 minutes');
await job.save();
```

```js
job.repeatEvery('3 minutes', {
	skipImmediate: true
});
await job.save();
```

```js
job.repeatEvery('0 6 * * *', {
	timezone: 'America/New_York'
});
await job.save();
```

### repeatAt(time)

Specifies a `time` when the job should repeat. [Possible values](https://github.com/matthewmueller/date#examples)

```js
job.repeatAt('3:30pm');
await job.save();
```

### schedule(time)

Specifies the next `time` at which the job should run.

```js
job.schedule('tomorrow at 6pm');
await job.save();
```

### priority(priority)

Specifies the `priority` weighting of the job. Can be a number or a string from
the above priority table.

```js
job.priority('low');
await job.save();
```

### setShouldSaveResult(setShouldSaveResult)

Specifies whether the result of the job should also be stored in the database. Defaults to false.

```js
job.setShouldSaveResult(true);
await job.save();
```

The data returned by the job will be available on the `result` attribute after it succeeded and got retrieved again from the database, e.g. via `agenda.jobs(...)` or through the [success job event](#agenda-events)).

### unique(properties, [options])

Ensure that only one instance of this job exists with the specified properties

`options` is an optional argument which can overwrite the defaults. It can take
the following:

- `insertOnly`: `boolean` will prevent any properties from persisting if the job already exists. Defaults to false.

```js
job.unique({ 'data.type': 'active', 'data.userId': '123', nextRunAt: date });
await job.save();
```

### fail(reason)

Sets `job.attrs.failedAt` to `now`, and sets `job.attrs.failReason` to `reason`.

Optionally, `reason` can be an error, in which case `job.attrs.failReason` will
be set to `error.message`

```js
job.fail('insufficient disk space');
// or
job.fail(new Error('insufficient disk space'));
await job.save();
```

### run(callback)

Runs the given `job` and calls `callback(err, job)` upon completion. Normally
you never need to call this manually.

```js
job.run((err, job) => {
	console.log("I don't know why you would need to do this...");
});
```

### save()

Saves the `job.attrs` into the database. Returns a Promise resolving to a Job instance, or rejecting on error.

```js
try {
	await job.save();
	cosole.log('Successfully saved job to collection');
} catch (e) {
	console.error('Error saving job to collection');
}
```

### remove()

Removes the `job` from the database. Returns a Promise resolving to the number of jobs removed, or rejecting on error.

```js
try {
	await job.remove();
	console.log('Successfully removed job from collection');
} catch (e) {
	console.error('Error removing job from collection');
}
```

### disable()

Disables the `job`. Upcoming runs won't execute.

### enable()

Enables the `job` if it got disabled before. Upcoming runs will execute.

### touch()

Resets the lock on the job. Useful to indicate that the job hasn't timed out
when you have very long running jobs. The call returns a promise that resolves
when the job's lock has been renewed.

```js
agenda.define('super long job', async job => {
	await doSomeLongTask();
	await job.touch();
	await doAnotherLongTask();
	await job.touch();
	await finishOurLongTasks();
});
```

## Job Queue Events

An instance of an agenda will emit the following events:

- `start` - called just before a job starts
- `start:job name` - called just before the specified job starts

```js
agenda.on('start', job => {
	console.log('Job %s starting', job.attrs.name);
});
```

- `complete` - called when a job finishes, regardless of if it succeeds or fails
- `complete:job name` - called when a job finishes, regardless of if it succeeds or fails

```js
agenda.on('complete', job => {
	console.log(`Job ${job.attrs.name} finished`);
});
```

- `success` - called when a job finishes successfully
- `success:job name` - called when a job finishes successfully

```js
agenda.on('success:send email', job => {
	console.log(`Sent Email Successfully to ${job.attrs.data.to}`);
});
```

- `fail` - called when a job throws an error
- `fail:job name` - called when a job throws an error

```js
agenda.on('fail:send email', (err, job) => {
	console.log(`Job failed with error: ${err.message}`);
});
```

# Example Project Structure

Agenda will only process jobs that it has definitions for. This allows you to
selectively choose which jobs a given agenda will process.

Consider the following project structure, which allows us to share models with
the rest of our code base, and specify which jobs a worker processes, if any at
all.

```
- server.js
- worker.js
lib/
  - agenda.js
  controllers/
    - user-controller.js
  jobs/
    - email.js
    - video-processing.js
    - image-processing.js
   models/
     - user-model.js
     - blog-post.model.js
```

Sample job processor (eg. `jobs/email.js`)

```js
let email = require('some-email-lib'),
	User = require('../models/user-model.js');

module.exports = function (agenda) {
	agenda.define('registration email', async job => {
		const user = await User.get(job.attrs.data.userId);
		await email(user.email(), 'Thanks for registering', 'Thanks for registering ' + user.name());
	});

	agenda.define('reset password', async job => {
		// Etc
	});

	// More email related jobs
};
```

lib/agenda.js

```js
const Agenda = require('agenda');

const sqlAddress = 'postgres://postgres:postgres@localhost:5432/agenda_db';

const agenda = new Agenda(
	{
		db: {
			address: sqlAddress,
			options: {
				dialect: 'postgres'
			}
		}
	}
);

const jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : [];

jobTypes.forEach(type => {
	require('./jobs/' + type)(agenda);
});

if (jobTypes.length) {
	agenda.start(); // Returns a promise, which should be handled appropriately
}

module.exports = agenda;
```

lib/controllers/user-controller.js

```js
let app = express(),
	User = require('../models/user-model'),
	agenda = require('../worker.js');

app.post('/users', (req, res, next) => {
	const user = new User(req.body);
	user.save(err => {
		if (err) {
			return next(err);
		}
		agenda.now('registration email', { userId: user.primary() });
		res.send(201, user.toJson());
	});
});
```

worker.js

```js
require('./lib/agenda.js');
```

Now you can do the following in your project:

```bash
node server.js
```

Fire up an instance with no `JOB_TYPES`, giving you the ability to process jobs,
but not wasting resources processing jobs.

```bash
JOB_TYPES=email node server.js
```

Allow your http server to process email jobs.

```bash
JOB_TYPES=email node worker.js
```

Fire up an instance that processes email jobs.

```bash
JOB_TYPES=video-processing,image-processing node worker.js
```

Fire up an instance that processes video-processing/image-processing jobs. Good for a heavy hitting server.

#### To turn on logging, please set your DEBUG env variable like so:

- OSX: `DEBUG="agenda:*" ts-node src/index.ts`
- Linux: `DEBUG="agenda:*" ts-node src/index.ts`
- Windows CMD: `set DEBUG=agenda:*`
- Windows PowerShell: `$env:DEBUG = "agenda:*"`

While not necessary, attaching a text file with this debug information would
be extremely useful in debugging certain issues and is encouraged.

# Sandboxed Worker - use child processes

It's possible to start jobs in a child process, this helps for example for long running processes
to seperate them from the main thread. For example if one process consumes too much memory and gets killed,
it will not affect any others.
To use this feature, several steps are required.
1.) create a childWorker helper.
The subrocess has a complete seperate context, so there are no database connections or anything else that can be shared.
Therefore you have to ensure that all required connections and initializations are done here too. Furthermore
you also have to load the correct job definition so that agenda nows what code it must execute. Therefore 3 parameters
are passed to the childWorker: name, jobId and path to the job definition.

Example file can look like this:

childWorker.ts

```ts
import 'reflect-metadata';

process.on('message', message => {
  if (message === 'cancel') {
    process.exit(2);
  } else {
    console.log('got message', message);
  }
});

(async () => {
	const sequelize = /** connect to database */

  /** do other required initializations */

  // get process arguments (name, jobId and path to agenda definition file)
	const [, , name, jobId, agendaDefinition] = process.argv;

  // set fancy process title
	process.title = `${process.title} (sub worker: ${name}/${jobId})`;

  // initialize Agenda in "forkedWorker" mode
	const agenda = new Agenda({ name: `subworker-${name}`, forkedWorker: true });
	// connect agenda (but do not start it)
	await agenda.sql(sequelize);

	if (!name || !jobId) {
		throw new Error(`invalid parameters: ${JSON.stringify(process.argv)}`);
	}

  // load job definition
  /** in this case the file is for example ../some/path/definitions.js
  with a content like:
  export default (agenda: Agenda, definitionOnly = false) => {
    agenda.define(
      'some job',
      async (notification: {
        attrs: { data: { dealId: string; orderId: TypeObjectId<IOrder> } };
      }) => {
        // do something
      }
    );

    if (!definitionOnly) {
        // here you can create scheduled jobs or other things
    }
	});
  */
	if (agendaDefinition) {
		const loadDefinition = await import(agendaDefinition);
		(loadDefinition.default || loadDefinition)(agenda, true);
	}

  // run this job now
	await agenda.runForkedJob(jobId);

  // disconnect database and exit
	process.exit(0);
})().catch(err => {
	console.error('err', err);
	if (process.send) {
		process.send(JSON.stringify(err));
	}
	process.exit(1);
});


```

Ensure to only define job definitions during this step, otherwise you create some
overhead (e.g. if you create new jobs inside the defintion files). That's why I call
the defintion file with agenda and a second paramter that is set to true. If this
parameter is true, I do not initialize any jobs (create jobs etc..)

2.) to use this, you have to enable it on a job. Set forkMode to true:

```ts
const job = agenda.create('some job', { meep: 1 });
job.forkMode(true);
await job.save();
```

# Acknowledgements

- Agenda was originally created by [@rschmukler](https://github.com/rschmukler).
- [Agendash](https://github.com/agenda/agendash) was originally created by [@joeframbach](https://github.com/joeframbach).
- These days Agenda has a great community of [contributors](https://github.com/hokify/agenda/graphs/contributors) around it. Join us!

# License

[The MIT License](LICENSE.md)
