import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

config();

const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'postgres',
  synchronize: true,
  logging: false,
  entities: [
    // "src/entities/*.ts"
    'dist/entities/*.js',
  ],
  migrations: [],
  subscribers: [],
};

export default ormConfig;
