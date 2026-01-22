import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Note } from '../entities/Note';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Используем переменные окружения Railway или значения по умолчанию
// const dbConfig = {
//   type: 'postgres' as const,
//   url: process.env.DATABASE_URL, // Railway предоставляет DATABASE_URL
//   host: process.env.DB_HOST || 'gondola.proxy.rlwy.net',
//   port: parseInt(process.env.DB_PORT || '59825'),
//   database: process.env.DB_NAME || 'NOTE',
//   username: process.env.DB_USER || 'user',
//   password: process.env.DB_PASSWORD || '123456789',
//   synchronize: false,
//   logging: !isProduction, // Логи только в разработке
// };

export const AppDataSource = new DataSource({
  // ...dbConfig,
  // Используем DATABASE_URL если он есть (Railway предоставляет)
  // ...(process.env.DATABASE_URL ? { url: process.env.DATABASE_URL } : {
  //   host: dbConfig.host,
  //   port: dbConfig.port,
  //   database: dbConfig.database,
  //   username: dbConfig.username,
  //   password: dbConfig.password,

  type: 'postgres' as const,
  url: process.env.DATABASE_URL, // Railway предоставляет DATABASE_URL
  host: process.env.DB_HOST || 'gondola.proxy.rlwy.net',
  port: parseInt(process.env.DB_PORT || '59825'),
  database: process.env.DB_NAME || 'NOTE',
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || '123456789',
  synchronize: false,
  logging: !isProduction, // Логи только в разработке
  
  entities: [User, Note],
  
  // В продакшене используем .js файлы или отключаем миграции
  migrations: isProduction 
    ? [path.join(__dirname, '..', 'migrations', '*.js')] // JS файлы
    : [path.join(__dirname, '..', 'migrations', '*.ts')], // TS файлы
  
  migrationsTableName: 'migrations',
  extra: {
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  },
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
