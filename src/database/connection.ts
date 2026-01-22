import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Note } from '../entities/Note';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Получаем конфигурацию подключения
const getConnectionOptions = () => {
  // Если есть DATABASE_URL (Railway предоставляет его)
  if (process.env.DATABASE_URL) {
    return {
      url: process.env.DATABASE_URL,
      extra: {
        ssl: false
      }
    };
  }
  
  // Если нет DATABASE_URL, используем прямую конфигурацию
  return {
    host: process.env.DB_HOST || 'gondola.proxy.rlwy.net',
    port: parseInt(process.env.DB_PORT || '59825'),
    database: process.env.DB_NAME || 'NOTE',
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || '123456789',
    extra: {
      ssl: false
    }
  };
};

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...getConnectionOptions(),
  synchronize: false,
  logging: !isProduction,
  entities: [User, Note],
  migrations: isProduction 
    ? [path.join(__dirname, '..', 'migrations', '*.js')]
    : [path.join(__dirname, '..', 'migrations', '*.ts')],
  migrationsTableName: 'migrations',
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
