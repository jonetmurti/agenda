# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/jonetmurti/agenda-sql/compare/v5.0.0...v2.0.0) (2022-12-25)


### ⚠ BREAKING CHANGES

* Switching from [ncb000gt/node-cron](https://www.npmjs.com/package/cron) to [harrisiirak/cron-parser](https://www.npmjs.com/package/cron-parser) for cron-pattern parsing.

    Previously month was 0-based (0=January). Going forward standard Unix pattern is used, which is 1-based (1=January).

    Please update existing cron-patterns that specify a month (4th position of a pattern). The month is now 1 - 12

    1 = January

    2 = February

    3...

    | Example | Execute on 1st of January |
    |---------|---------------------------|
    | Old     | 0 0 1 **0** *             |
    | New     | 0 0 1 **1** *             |

    old Cron patterns

    ```
    * * * * * *
    | | | | | |
    | | | | | +-- Year              (range: 1900-3000)
    | | | | +---- Day of the Week   (range: 1-7, 1 standing for Monday)
    | | | +------ Month of the Year (range: 0-11) NOTE: Difference here
    | | +-------- Day of the Month  (range: 1-31)
    | +---------- Hour              (range: 0-23)
    +------------ Minute            (range: 0-59)
    ```

    new cron patterns

    ```
    * * * * * *
    | | | | | |
    | | | | | +-- Year              (range: 1900-3000)
    | | | | +---- Day of the Week   (range: 1-7, 1 standing for Monday)
    | | | +------ Month of the Year (range: 1-12) NOTE: Difference here
    | | +-------- Day of the Month  (range: 1-31)
    | +---------- Hour              (range: 0-23)
    +------------ Minute            (range: 0-59)
    ```

Co-authored-by: Aras Abbasi <a.abbasi@cognigy.com>

### Features

* add queue size to running stats ([6271781](https://github.com/jonetmurti/agenda-sql/commit/6271781ea564d2d7d58b58b21c4bbc84ac793df1))
* allow to fork jobs in isolated sub process ([2a68c95](https://github.com/jonetmurti/agenda-sql/commit/2a68c9574e888b8b91196f6b237d901d944340a4))
* check if job state update was successful before running a job ([606e141](https://github.com/jonetmurti/agenda-sql/commit/606e1413ec939d1e368db4a1af67c86d867b48d5))
* isRunning querys database again if called by client ([1aaaa61](https://github.com/jonetmurti/agenda-sql/commit/1aaaa61f0a009563a84cb81036427c187076f190))


### Bug Fixes

* add fork paramters to console ([9f2e7fd](https://github.com/jonetmurti/agenda-sql/commit/9f2e7fd5351dd42a060059fcb03234afb1dd9d8a))
* add job name again stats output ([1aa2d4a](https://github.com/jonetmurti/agenda-sql/commit/1aa2d4a916ea3a1b0f573e935f435f7ebcf31cb1))
* add types for chai and fix expect in agenda.test.ts ([7d508a9](https://github.com/jonetmurti/agenda-sql/commit/7d508a91219be5a668ce346a277c922a6538128d))
* add typings for events ([a6c0356](https://github.com/jonetmurti/agenda-sql/commit/a6c0356964eee103299bbee4f8ec3d0f40f5129d))
* allow data type defintions for jobs ([ef85fc5](https://github.com/jonetmurti/agenda-sql/commit/ef85fc5ab8438539c009e964047a9bc60b984fb6))
* allow passing forkMode to every ([ff274ba](https://github.com/jonetmurti/agenda-sql/commit/ff274babb98ed859625986a174bcc27d36346820))
* allow returing details for status ([7a8a5bf](https://github.com/jonetmurti/agenda-sql/commit/7a8a5bf87266eacd84f0e6b5fd1457a7a6b99def))
* bind correct context to process ([cf70739](https://github.com/jonetmurti/agenda-sql/commit/cf707396707b36d293eb99a79fbc618b75a54900))
* changelog for v4 ([dd8b569](https://github.com/jonetmurti/agenda-sql/commit/dd8b569cf8df753d29b6913d6bc8d45403355860))
* check if abort controller is supported ([a00d611](https://github.com/jonetmurti/agenda-sql/commit/a00d611839e69318fe5e71cfa600a344c3dc6746))
* check if job has expired before we run it ([e301511](https://github.com/jonetmurti/agenda-sql/commit/e3015112ad1eb3d4852bae6686494e1316f02267))
* check if job is still alive ([a39c809](https://github.com/jonetmurti/agenda-sql/commit/a39c809b9efff79696b5d7c6f15b726df62dbbe9))
* check if lockedAt has been resetted in the meantime ([aa5323b](https://github.com/jonetmurti/agenda-sql/commit/aa5323b5669453761e8a1ddd146df828e6b2b410))
* **define:** warning if job definition exists already ([3fe9a6d](https://github.com/jonetmurti/agenda-sql/commit/3fe9a6d69e5dd177d513e54f1386980280201369))
* ensure check if job is dead is ending sometime :-) ([39950f3](https://github.com/jonetmurti/agenda-sql/commit/39950f38835dd501083d2075a788f176c61e52d9))
* ensure jobs are filled up till concurrency reached ([1a8bb31](https://github.com/jonetmurti/agenda-sql/commit/1a8bb31fde08b80ba41078930467ab18e82cf386))
* ensure locked at is processed as date ([3a5a0c4](https://github.com/jonetmurti/agenda-sql/commit/3a5a0c4123506001c4898020aa489eb8fd20c311))
* ensure new jobs are put on the left side of the job processing queue ([30e68ba](https://github.com/jonetmurti/agenda-sql/commit/30e68bad188cf55d34fb0c82f214de50eb997021))
* export all kind of types ([3bd90dc](https://github.com/jonetmurti/agenda-sql/commit/3bd90dcb1f2a1f50e630f56cd4ba150608dd77af))
* fix outpout of agenda job status details ([82ab1a8](https://github.com/jonetmurti/agenda-sql/commit/82ab1a8bd41eee6e4050c852f05c3fcb0b2d0c4f))
* fix outpout of agenda job status details ([7b24f88](https://github.com/jonetmurti/agenda-sql/commit/7b24f8872bcbf9179c9905508defffdc01d95373))
* fix outpout of agenda job status details ([3dc0709](https://github.com/jonetmurti/agenda-sql/commit/3dc0709a9c320175f8f455ef6f00dfb51ae6328a))
* give the test some more time ([e2cacb5](https://github.com/jonetmurti/agenda-sql/commit/e2cacb533b211ae28a3d4ee278918be4d0f897e9))
* improve error message for on handler ([92d42ca](https://github.com/jonetmurti/agenda-sql/commit/92d42ca1e0e0267855c613348ec06a281204dc4b))
* improve errors for childs ([8e3b827](https://github.com/jonetmurti/agenda-sql/commit/8e3b8277d839c935e69f31a57177c7f79dbec836))
* improve exit code error message ([f1a5eb8](https://github.com/jonetmurti/agenda-sql/commit/f1a5eb816de789c64a65a44f9443f286c794caf6))
* improve locking and ensure locks are released ([3160f0d](https://github.com/jonetmurti/agenda-sql/commit/3160f0dde049984d4ffaf721c38032376b281edb))
* isRunning for non job processor calls ([a5bb965](https://github.com/jonetmurti/agenda-sql/commit/a5bb965a57ffe28db8eae40311e0c102210509fa))
* isRunning, check if db returns a result ([e6ea7e2](https://github.com/jonetmurti/agenda-sql/commit/e6ea7e2817d7d5a113de80f68c33c62b75a8602a))
* job processor handling for recurring jobs could fill up queue and block processing ([54bc53c](https://github.com/jonetmurti/agenda-sql/commit/54bc53c5ab995671e1b38e78f3afb06c82f9a830))
* job processor localQueueProcessing flag ([413f673](https://github.com/jonetmurti/agenda-sql/commit/413f673ce0cd8a73132853f14feb8ed9f300c4e4))
* job timeout check and improve error handling for childs ([b365957](https://github.com/jonetmurti/agenda-sql/commit/b36595745e8b43939f9938b78af8d5a2e033b8fb))
* **job-processor:** emit error when db query fails ([9bfabd3](https://github.com/jonetmurti/agenda-sql/commit/9bfabd3359051d04d4664b7821248cab7708b82a))
* **job-processor:** emit error when db query fails ([eff80aa](https://github.com/jonetmurti/agenda-sql/commit/eff80aa60de38644235653ab81860915a1e32b17))
* **job:** ensure agenda is ready before calling save job ([be4c026](https://github.com/jonetmurti/agenda-sql/commit/be4c0268c829676e61a9ad45fcf66d714d8923ca))
* **jobprocessor:** check for object.fromEntries for node 10 support ([#3](https://github.com/jonetmurti/agenda-sql/issues/3)) ([b8cc61f](https://github.com/jonetmurti/agenda-sql/commit/b8cc61fe1e4199437d65014bff03cab65e6e077f))
* **jobprocessor:** check if set timeout value is valid ([2afaaa3](https://github.com/jonetmurti/agenda-sql/commit/2afaaa3227bf78978024c914dbc4be0c29dff7a9))
* **jobprocessor:** ensure returnNextConcurrencyFreeJob is not returning same job each time ([11d6606](https://github.com/jonetmurti/agenda-sql/commit/11d6606706d70416a6d28a95dd65ab11576f8e51))
* **jobprocessor:** ensure set timeout is only called once for each job in the queue ([1590224](https://github.com/jonetmurti/agenda-sql/commit/159022495a83980aad82a5244313b8c0e7db9942))
* **jobprocessor:** improve checkIfJobIsStillAlive ([2919083](https://github.com/jonetmurti/agenda-sql/commit/29190836cdc917eea6dd1f58d650c1d29c29514f))
* **jobprocessor:** introduce a canceled property to check if job is still alive ([55b63d7](https://github.com/jonetmurti/agenda-sql/commit/55b63d787a3252adca316c97b7b6156ecb45853d))
* **jobprocessor:** prevent overloading of job queue processing ([9854007](https://github.com/jonetmurti/agenda-sql/commit/98540074fc76c1f8cbed269e239bd2e615629421))
* **jobprocessor:** set job enqueud to true for future jobs ([a3d4203](https://github.com/jonetmurti/agenda-sql/commit/a3d42032011f868628862942737cdfc1594bb02b))
* **locking:** ensure jobs are not locked too greedy ([5bc123a](https://github.com/jonetmurti/agenda-sql/commit/5bc123a494703ea03108a0ed256aa207f02465bb))
* logic for datbase connection ([7ee64c1](https://github.com/jonetmurti/agenda-sql/commit/7ee64c1ea6fd2b1f157917a0bdaed2b286510092))
* more typings ([#5](https://github.com/jonetmurti/agenda-sql/issues/5)) ([8d6e137](https://github.com/jonetmurti/agenda-sql/commit/8d6e13702bc1ce427ddc4cf6d5e7f7502af8db8c))
* more typings, minor functionality changes ([#2](https://github.com/jonetmurti/agenda-sql/issues/2)) ([b13d054](https://github.com/jonetmurti/agenda-sql/commit/b13d054889638e218a2706f05512340e764c395b))
* nextRunAt value can be null ([e39cfd0](https://github.com/jonetmurti/agenda-sql/commit/e39cfd089248a7a235cf69888c9714a99988a75f))
* not running jobs even though concurrency is not reached ([0e82025](https://github.com/jonetmurti/agenda-sql/commit/0e82025678679d9c0d083824df955409c04f3956))
* only unlock jobs which have a nextRunAt jobs on shutdown ([291f16e](https://github.com/jonetmurti/agenda-sql/commit/291f16e7a32e92d44263ad4399237bef1a2168cb))
* only unlock jobs with a next run at date on shutdown ([a458aea](https://github.com/jonetmurti/agenda-sql/commit/a458aea0017bf9ddde44f587e6e7da99b456663b))
* only update job state fields during job processing ([be8e51b](https://github.com/jonetmurti/agenda-sql/commit/be8e51b197f46d6bf2bf6d36ce7cdcbe6df72cfd))
* **process-jobs:** also add name to lock call ([481ea77](https://github.com/jonetmurti/agenda-sql/commit/481ea77bebbd9cea2966b0cb8f4e401650147633))
* ready and error events are allowed wihtin sub workers ([cb4228c](https://github.com/jonetmurti/agenda-sql/commit/cb4228c21c4d96be8425c420650671de6b518b8d))
* rename err to error, fix typing of DefinitionProcessor, use debug ins… ([#9](https://github.com/jonetmurti/agenda-sql/issues/9)) ([39b598e](https://github.com/jonetmurti/agenda-sql/commit/39b598e24784da6cf640a29c2ce02732786e62fa))
* simplify default values ([35d5424](https://github.com/jonetmurti/agenda-sql/commit/35d5424eb58e6237bac79db6dc81a82eef640f79))
* simplify unlocking and improve logging ([a70f500](https://github.com/jonetmurti/agenda-sql/commit/a70f5009edd4d689305da6381caa08fec9c37036))
* skip index creation ([5242736](https://github.com/jonetmurti/agenda-sql/commit/5242736d8e9dd0834d8eee2277f2de7223f52551))
* small code cleanups and new flag to toggle ([2a6e5fe](https://github.com/jonetmurti/agenda-sql/commit/2a6e5fe12e40447f1e30f1d53deb99c47ae92e68))
* **test:** cleanup tests ([c5d081a](https://github.com/jonetmurti/agenda-sql/commit/c5d081a5c4be45b44ffc4aba56c0be4b9dcdd714))
* **test:** debug failed lock expire test ([7d69680](https://github.com/jonetmurti/agenda-sql/commit/7d69680f4d69663037ee238480d96e2788e1f572))
* **test:** debug failed priority test ([924287c](https://github.com/jonetmurti/agenda-sql/commit/924287c4419a19dfc16ba756e3e064e163b1b048))
* **test:** fix timeout check ([e92cd85](https://github.com/jonetmurti/agenda-sql/commit/e92cd85c80a1e092405f00066359d595be03ad2f))
* **test:** just check if there are almost all jobs running ([b2a5e6e](https://github.com/jonetmurti/agenda-sql/commit/b2a5e6ebf99aa3b1749b671eeadf0c6e08e4bae8))
* tests, agenda-instance should have a smaller processEvery ([b248a2b](https://github.com/jonetmurti/agenda-sql/commit/b248a2b6c0403e6e355da88c96fda7b62e2e08db))
* **tests:** rm console log from debugging ([b211c8e](https://github.com/jonetmurti/agenda-sql/commit/b211c8e7a30c731a3f2c3c9f01603f904bb52660))
* **test:** unlock job test fix ([6446b64](https://github.com/jonetmurti/agenda-sql/commit/6446b64c9f22bbbb2ec098cec5c55ca9d659d439))
* too greedy locking ([26ad106](https://github.com/jonetmurti/agenda-sql/commit/26ad1067d715cd113079f207cc489cbf0adff706))
* try to solve the locking issue ([d2f3b20](https://github.com/jonetmurti/agenda-sql/commit/d2f3b207ee643b804d19226b70e8b0abd0695b06))
* **typings:** names -> name ([c2ca928](https://github.com/jonetmurti/agenda-sql/commit/c2ca9286abdc46b7aa22024170bf9e73f142a9e9))
* update deps and switch moment-timezone to luxon ([e5eb973](https://github.com/jonetmurti/agenda-sql/commit/e5eb973deaa3e02bc071b26e57edd6735928bb70))
* **update:** when saving a job via _id add job name ([24f6a84](https://github.com/jonetmurti/agenda-sql/commit/24f6a84451e8e4b995a5dcc418f0c1dd26fe8674))
* use different appraoch to find definition file ([9d4c60e](https://github.com/jonetmurti/agenda-sql/commit/9d4c60ef7583a3bd27e4ed626624b684079f06bc))
* use isNaN check in isValidDate ([#10](https://github.com/jonetmurti/agenda-sql/issues/10)) ([3bc2e30](https://github.com/jonetmurti/agenda-sql/commit/3bc2e303d280c19899beacf7c7a732e4a6b08724))
* use message bus instead of signal to cancel child ([fcec3a9](https://github.com/jonetmurti/agenda-sql/commit/fcec3a9bf43e36d4d3d81319ac71d1b3b01e16be))
* use new mongo stack ([a2e74a9](https://github.com/jonetmurti/agenda-sql/commit/a2e74a9d86b978d6179a9fcbcf25728c8391175d))
* wait for start of test job ([413f797](https://github.com/jonetmurti/agenda-sql/commit/413f79753a63f74b6c7a5bb3acf5e2e54e934fab))


* switching from cron to cron-parser ([#16](https://github.com/jonetmurti/agenda-sql/issues/16)) ([e5c3bf1](https://github.com/jonetmurti/agenda-sql/commit/e5c3bf12d4b5db8ec846b0c9c332e247077d3485))

## [2.0.0](https://github.com/hokify/agenda/compare/v5.0.0...v2.0.0) (2022-12-25)


### ⚠ BREAKING CHANGES

* Switching from [ncb000gt/node-cron](https://www.npmjs.com/package/cron) to [harrisiirak/cron-parser](https://www.npmjs.com/package/cron-parser) for cron-pattern parsing.

    Previously month was 0-based (0=January). Going forward standard Unix pattern is used, which is 1-based (1=January).

    Please update existing cron-patterns that specify a month (4th position of a pattern). The month is now 1 - 12

    1 = January

    2 = February

    3...

    | Example | Execute on 1st of January |
    |---------|---------------------------|
    | Old     | 0 0 1 **0** *             |
    | New     | 0 0 1 **1** *             |

    old Cron patterns

    ```
    * * * * * *
    | | | | | |
    | | | | | +-- Year              (range: 1900-3000)
    | | | | +---- Day of the Week   (range: 1-7, 1 standing for Monday)
    | | | +------ Month of the Year (range: 0-11) NOTE: Difference here
    | | +-------- Day of the Month  (range: 1-31)
    | +---------- Hour              (range: 0-23)
    +------------ Minute            (range: 0-59)
    ```

    new cron patterns

    ```
    * * * * * *
    | | | | | |
    | | | | | +-- Year              (range: 1900-3000)
    | | | | +---- Day of the Week   (range: 1-7, 1 standing for Monday)
    | | | +------ Month of the Year (range: 1-12) NOTE: Difference here
    | | +-------- Day of the Month  (range: 1-31)
    | +---------- Hour              (range: 0-23)
    +------------ Minute            (range: 0-59)
    ```

Co-authored-by: Aras Abbasi <a.abbasi@cognigy.com>

### Features

* add queue size to running stats ([6271781](https://github.com/hokify/agenda/commit/6271781ea564d2d7d58b58b21c4bbc84ac793df1))
* allow to fork jobs in isolated sub process ([2a68c95](https://github.com/hokify/agenda/commit/2a68c9574e888b8b91196f6b237d901d944340a4))
* check if job state update was successful before running a job ([606e141](https://github.com/hokify/agenda/commit/606e1413ec939d1e368db4a1af67c86d867b48d5))
* isRunning querys database again if called by client ([1aaaa61](https://github.com/hokify/agenda/commit/1aaaa61f0a009563a84cb81036427c187076f190))


### Bug Fixes

* add fork paramters to console ([9f2e7fd](https://github.com/hokify/agenda/commit/9f2e7fd5351dd42a060059fcb03234afb1dd9d8a))
* add job name again stats output ([1aa2d4a](https://github.com/hokify/agenda/commit/1aa2d4a916ea3a1b0f573e935f435f7ebcf31cb1))
* add types for chai and fix expect in agenda.test.ts ([7d508a9](https://github.com/hokify/agenda/commit/7d508a91219be5a668ce346a277c922a6538128d))
* add typings for events ([a6c0356](https://github.com/hokify/agenda/commit/a6c0356964eee103299bbee4f8ec3d0f40f5129d))
* allow data type defintions for jobs ([ef85fc5](https://github.com/hokify/agenda/commit/ef85fc5ab8438539c009e964047a9bc60b984fb6))
* allow passing forkMode to every ([ff274ba](https://github.com/hokify/agenda/commit/ff274babb98ed859625986a174bcc27d36346820))
* allow returing details for status ([7a8a5bf](https://github.com/hokify/agenda/commit/7a8a5bf87266eacd84f0e6b5fd1457a7a6b99def))
* bind correct context to process ([cf70739](https://github.com/hokify/agenda/commit/cf707396707b36d293eb99a79fbc618b75a54900))
* changelog for v4 ([dd8b569](https://github.com/hokify/agenda/commit/dd8b569cf8df753d29b6913d6bc8d45403355860))
* check if abort controller is supported ([a00d611](https://github.com/hokify/agenda/commit/a00d611839e69318fe5e71cfa600a344c3dc6746))
* check if job has expired before we run it ([e301511](https://github.com/hokify/agenda/commit/e3015112ad1eb3d4852bae6686494e1316f02267))
* check if job is still alive ([a39c809](https://github.com/hokify/agenda/commit/a39c809b9efff79696b5d7c6f15b726df62dbbe9))
* check if lockedAt has been resetted in the meantime ([aa5323b](https://github.com/hokify/agenda/commit/aa5323b5669453761e8a1ddd146df828e6b2b410))
* **define:** warning if job definition exists already ([3fe9a6d](https://github.com/hokify/agenda/commit/3fe9a6d69e5dd177d513e54f1386980280201369))
* ensure check if job is dead is ending sometime :-) ([39950f3](https://github.com/hokify/agenda/commit/39950f38835dd501083d2075a788f176c61e52d9))
* ensure jobs are filled up till concurrency reached ([1a8bb31](https://github.com/hokify/agenda/commit/1a8bb31fde08b80ba41078930467ab18e82cf386))
* ensure locked at is processed as date ([3a5a0c4](https://github.com/hokify/agenda/commit/3a5a0c4123506001c4898020aa489eb8fd20c311))
* ensure new jobs are put on the left side of the job processing queue ([30e68ba](https://github.com/hokify/agenda/commit/30e68bad188cf55d34fb0c82f214de50eb997021))
* export all kind of types ([3bd90dc](https://github.com/hokify/agenda/commit/3bd90dcb1f2a1f50e630f56cd4ba150608dd77af))
* fix outpout of agenda job status details ([82ab1a8](https://github.com/hokify/agenda/commit/82ab1a8bd41eee6e4050c852f05c3fcb0b2d0c4f))
* fix outpout of agenda job status details ([7b24f88](https://github.com/hokify/agenda/commit/7b24f8872bcbf9179c9905508defffdc01d95373))
* fix outpout of agenda job status details ([3dc0709](https://github.com/hokify/agenda/commit/3dc0709a9c320175f8f455ef6f00dfb51ae6328a))
* give the test some more time ([e2cacb5](https://github.com/hokify/agenda/commit/e2cacb533b211ae28a3d4ee278918be4d0f897e9))
* improve error message for on handler ([92d42ca](https://github.com/hokify/agenda/commit/92d42ca1e0e0267855c613348ec06a281204dc4b))
* improve errors for childs ([8e3b827](https://github.com/hokify/agenda/commit/8e3b8277d839c935e69f31a57177c7f79dbec836))
* improve exit code error message ([f1a5eb8](https://github.com/hokify/agenda/commit/f1a5eb816de789c64a65a44f9443f286c794caf6))
* improve locking and ensure locks are released ([3160f0d](https://github.com/hokify/agenda/commit/3160f0dde049984d4ffaf721c38032376b281edb))
* isRunning for non job processor calls ([a5bb965](https://github.com/hokify/agenda/commit/a5bb965a57ffe28db8eae40311e0c102210509fa))
* isRunning, check if db returns a result ([e6ea7e2](https://github.com/hokify/agenda/commit/e6ea7e2817d7d5a113de80f68c33c62b75a8602a))
* job processor handling for recurring jobs could fill up queue and block processing ([54bc53c](https://github.com/hokify/agenda/commit/54bc53c5ab995671e1b38e78f3afb06c82f9a830))
* job processor localQueueProcessing flag ([413f673](https://github.com/hokify/agenda/commit/413f673ce0cd8a73132853f14feb8ed9f300c4e4))
* job timeout check and improve error handling for childs ([b365957](https://github.com/hokify/agenda/commit/b36595745e8b43939f9938b78af8d5a2e033b8fb))
* **job-processor:** emit error when db query fails ([9bfabd3](https://github.com/hokify/agenda/commit/9bfabd3359051d04d4664b7821248cab7708b82a))
* **job-processor:** emit error when db query fails ([eff80aa](https://github.com/hokify/agenda/commit/eff80aa60de38644235653ab81860915a1e32b17))
* **job:** ensure agenda is ready before calling save job ([be4c026](https://github.com/hokify/agenda/commit/be4c0268c829676e61a9ad45fcf66d714d8923ca))
* **jobprocessor:** check for object.fromEntries for node 10 support ([#3](https://github.com/hokify/agenda/issues/3)) ([b8cc61f](https://github.com/hokify/agenda/commit/b8cc61fe1e4199437d65014bff03cab65e6e077f))
* **jobprocessor:** check if set timeout value is valid ([2afaaa3](https://github.com/hokify/agenda/commit/2afaaa3227bf78978024c914dbc4be0c29dff7a9))
* **jobprocessor:** ensure returnNextConcurrencyFreeJob is not returning same job each time ([11d6606](https://github.com/hokify/agenda/commit/11d6606706d70416a6d28a95dd65ab11576f8e51))
* **jobprocessor:** ensure set timeout is only called once for each job in the queue ([1590224](https://github.com/hokify/agenda/commit/159022495a83980aad82a5244313b8c0e7db9942))
* **jobprocessor:** improve checkIfJobIsStillAlive ([2919083](https://github.com/hokify/agenda/commit/29190836cdc917eea6dd1f58d650c1d29c29514f))
* **jobprocessor:** introduce a canceled property to check if job is still alive ([55b63d7](https://github.com/hokify/agenda/commit/55b63d787a3252adca316c97b7b6156ecb45853d))
* **jobprocessor:** prevent overloading of job queue processing ([9854007](https://github.com/hokify/agenda/commit/98540074fc76c1f8cbed269e239bd2e615629421))
* **jobprocessor:** set job enqueud to true for future jobs ([a3d4203](https://github.com/hokify/agenda/commit/a3d42032011f868628862942737cdfc1594bb02b))
* **locking:** ensure jobs are not locked too greedy ([5bc123a](https://github.com/hokify/agenda/commit/5bc123a494703ea03108a0ed256aa207f02465bb))
* logic for datbase connection ([7ee64c1](https://github.com/hokify/agenda/commit/7ee64c1ea6fd2b1f157917a0bdaed2b286510092))
* more typings ([#5](https://github.com/hokify/agenda/issues/5)) ([8d6e137](https://github.com/hokify/agenda/commit/8d6e13702bc1ce427ddc4cf6d5e7f7502af8db8c))
* more typings, minor functionality changes ([#2](https://github.com/hokify/agenda/issues/2)) ([b13d054](https://github.com/hokify/agenda/commit/b13d054889638e218a2706f05512340e764c395b))
* nextRunAt value can be null ([e39cfd0](https://github.com/hokify/agenda/commit/e39cfd089248a7a235cf69888c9714a99988a75f))
* not running jobs even though concurrency is not reached ([0e82025](https://github.com/hokify/agenda/commit/0e82025678679d9c0d083824df955409c04f3956))
* only unlock jobs which have a nextRunAt jobs on shutdown ([291f16e](https://github.com/hokify/agenda/commit/291f16e7a32e92d44263ad4399237bef1a2168cb))
* only unlock jobs with a next run at date on shutdown ([a458aea](https://github.com/hokify/agenda/commit/a458aea0017bf9ddde44f587e6e7da99b456663b))
* only update job state fields during job processing ([be8e51b](https://github.com/hokify/agenda/commit/be8e51b197f46d6bf2bf6d36ce7cdcbe6df72cfd))
* **process-jobs:** also add name to lock call ([481ea77](https://github.com/hokify/agenda/commit/481ea77bebbd9cea2966b0cb8f4e401650147633))
* ready and error events are allowed wihtin sub workers ([cb4228c](https://github.com/hokify/agenda/commit/cb4228c21c4d96be8425c420650671de6b518b8d))
* rename err to error, fix typing of DefinitionProcessor, use debug ins… ([#9](https://github.com/hokify/agenda/issues/9)) ([39b598e](https://github.com/hokify/agenda/commit/39b598e24784da6cf640a29c2ce02732786e62fa))
* simplify default values ([35d5424](https://github.com/hokify/agenda/commit/35d5424eb58e6237bac79db6dc81a82eef640f79))
* simplify unlocking and improve logging ([a70f500](https://github.com/hokify/agenda/commit/a70f5009edd4d689305da6381caa08fec9c37036))
* skip index creation ([5242736](https://github.com/hokify/agenda/commit/5242736d8e9dd0834d8eee2277f2de7223f52551))
* small code cleanups and new flag to toggle ([2a6e5fe](https://github.com/hokify/agenda/commit/2a6e5fe12e40447f1e30f1d53deb99c47ae92e68))
* **test:** cleanup tests ([c5d081a](https://github.com/hokify/agenda/commit/c5d081a5c4be45b44ffc4aba56c0be4b9dcdd714))
* **test:** debug failed lock expire test ([7d69680](https://github.com/hokify/agenda/commit/7d69680f4d69663037ee238480d96e2788e1f572))
* **test:** debug failed priority test ([924287c](https://github.com/hokify/agenda/commit/924287c4419a19dfc16ba756e3e064e163b1b048))
* **test:** fix timeout check ([e92cd85](https://github.com/hokify/agenda/commit/e92cd85c80a1e092405f00066359d595be03ad2f))
* **test:** just check if there are almost all jobs running ([b2a5e6e](https://github.com/hokify/agenda/commit/b2a5e6ebf99aa3b1749b671eeadf0c6e08e4bae8))
* tests, agenda-instance should have a smaller processEvery ([b248a2b](https://github.com/hokify/agenda/commit/b248a2b6c0403e6e355da88c96fda7b62e2e08db))
* **tests:** rm console log from debugging ([b211c8e](https://github.com/hokify/agenda/commit/b211c8e7a30c731a3f2c3c9f01603f904bb52660))
* **test:** unlock job test fix ([6446b64](https://github.com/hokify/agenda/commit/6446b64c9f22bbbb2ec098cec5c55ca9d659d439))
* too greedy locking ([26ad106](https://github.com/hokify/agenda/commit/26ad1067d715cd113079f207cc489cbf0adff706))
* try to solve the locking issue ([d2f3b20](https://github.com/hokify/agenda/commit/d2f3b207ee643b804d19226b70e8b0abd0695b06))
* **typings:** names -> name ([c2ca928](https://github.com/hokify/agenda/commit/c2ca9286abdc46b7aa22024170bf9e73f142a9e9))
* update deps and switch moment-timezone to luxon ([e5eb973](https://github.com/hokify/agenda/commit/e5eb973deaa3e02bc071b26e57edd6735928bb70))
* **update:** when saving a job via _id add job name ([24f6a84](https://github.com/hokify/agenda/commit/24f6a84451e8e4b995a5dcc418f0c1dd26fe8674))
* use different appraoch to find definition file ([9d4c60e](https://github.com/hokify/agenda/commit/9d4c60ef7583a3bd27e4ed626624b684079f06bc))
* use isNaN check in isValidDate ([#10](https://github.com/hokify/agenda/issues/10)) ([3bc2e30](https://github.com/hokify/agenda/commit/3bc2e303d280c19899beacf7c7a732e4a6b08724))
* use message bus instead of signal to cancel child ([fcec3a9](https://github.com/hokify/agenda/commit/fcec3a9bf43e36d4d3d81319ac71d1b3b01e16be))
* use new mongo stack ([a2e74a9](https://github.com/hokify/agenda/commit/a2e74a9d86b978d6179a9fcbcf25728c8391175d))
* wait for start of test job ([413f797](https://github.com/hokify/agenda/commit/413f79753a63f74b6c7a5bb3acf5e2e54e934fab))


* switching from cron to cron-parser ([#16](https://github.com/hokify/agenda/issues/16)) ([e5c3bf1](https://github.com/hokify/agenda/commit/e5c3bf12d4b5db8ec846b0c9c332e247077d3485))
