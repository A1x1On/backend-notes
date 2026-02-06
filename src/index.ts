import 'reflect-metadata';
import { ServiceBroker } from 'moleculer';
import { initializeDatabase } from './database/connection';
import * as path from 'path';

// Определяем расширение файлов в зависимости от окружения
const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.RAILWAY_PORT : process.env.PORT;

console.log('isProduction', isProduction);
const broker = new ServiceBroker({
  logger: true,
  logLevel: 'info',
  // Отключаем hot reload в продакшене
  hotReload: !isProduction,
});


// Загружаем сервисы с правильными путями
const services = [
  'api.service',
  'user.service', 
  'note.service',
  'code.service'
];

for (const serviceName of services) {
  console.log('__dirname', __dirname);
  if (isProduction) {
    // В продакшене загружаем из dist
    broker.loadService(path.join(__dirname, 'services', `${serviceName}.js`));
  } else {
    // В разработке загружаем из src
    broker.loadService(`./src/services/${serviceName}.ts`);
  }
}

// Импортируем moleculer-web правильно
import ApiGateway from 'moleculer-web';

// API Gateway service
broker.createService({
  name: 'gateway',
  mixins: [ApiGateway],
  settings: {
    port,

    cors: {
      origin: '*',
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },

    bodyParsers: {
      json: {
        strict: false,
        limit: '10MB',
      },
      urlencoded: {
        extended: true,
        limit: '10MB',
      },
    },

    routes: [
      {
        path: '/api',
        aliases: {
          'GET health': 'api.healthCheck',
        },
        onBeforeCall(ctx: any, _: any, req: any) {
          ctx.meta.body = req.body;
        },
      },

      {
        path: '/users',
        aliases: {
          'GET ': 'users.getUsers',
          'POST ': 'users.createUsers',
        },
        onBeforeCall(ctx: any, _: any, req: any) {
          ctx.meta.body = req.body;
        },
      },

      {
        path: '/notes',
        aliases: {
          'GET ': 'notes.getAll',
          'GET /:id': 'notes.getOne',
          'POST ': 'notes.insert',
          'PATCH /:id': 'notes.update',
          'DELETE /:id': 'notes.delete',
        },
      },

      {
        path: '/codes',
        aliases: {
          'GET ': 'codes.getAll',
        }
      },
    ],
  },
  methods: {
    onRequest(req: any) {
      console.log(`📨 ${req.method} ${req.url}`);
      if (req.body) {
        console.log('Request body:', req.body);
      }
    },
  },
});

async function startServer() {
  try {
    console.log(`Starting in ${isProduction ? 'production' : 'development'} mode`);
    
    console.log('Initializing database...');
    await initializeDatabase();

    console.log('Starting Moleculer broker...');
    await broker.start();

    console.log(`Server started on port ${port}`);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await broker.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  await broker.stop();
  process.exit(0);
});

startServer();