import { AppDataSource } from '../database/connection';

module.exports = {
  name: 'api',

  actions: {
    async healthCheck() {
      return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: AppDataSource.isInitialized ? 'connected' : 'disconnected',
      };
    },
  },

  started() {
    console.log('API Service started');
  },
};
