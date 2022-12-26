import type { Options, Sequelize, Order } from 'sequelize';

export interface ISqlOptions {
	db: {
		address: string;
		options: Options;
	};
}

export interface ISqlConfig {
	ensureIndex?: boolean;
	enableMigration?: boolean;
	sort?: Order;
}

export interface ISqlConnection {
	sequelize: Sequelize;
}
