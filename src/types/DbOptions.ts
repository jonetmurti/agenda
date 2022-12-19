import type { Db, MongoClientOptions, SortDirection } from 'mongodb';
import type { Options, Sequelize, Order } from 'sequelize';

export interface IDatabaseOptions {
	db: {
		collection?: string;
		address: string;
		options?: MongoClientOptions;
	};
}

export interface IMongoOptions {
	db?: {
		collection?: string;
	};
	mongo: Db;
}

export interface IDbConfig {
	ensureIndex?: boolean;
	sort?: {
		[key: string]: SortDirection;
	};
}

export interface ISqlOptions {
	db: {
		address?: string;
		options: Options;
	},
}

export interface ISqlConfig {
	ensureIndex?: boolean;
	enableMigration?: boolean;
	sort?: Order;
}

export interface ISqlConnection {
	sequelize: Sequelize;
}
