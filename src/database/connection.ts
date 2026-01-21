import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Note } from '../entities/Note';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  // host: process.env.DB_HOST || 'localhost',
  // port: parseInt(process.env.DB_PORT || '5432'),
  // database: process.env.DB_NAME || 'postgres',
  // username: process.env.DB_USER || 'user',
  // password: process.env.DB_PASSWORD || 'password',

  host: 'gondola.proxy.rlwy.net',
  port: 59825,
  database: 'NOTE',
  username: 'user',
  password: '123456789',

  synchronize: false,
  logging: true,
  entities: [User, Note],
  migrations: ['src/migrations/**/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully');

    // Выполнение миграций
    await AppDataSource.runMigrations();
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
};
