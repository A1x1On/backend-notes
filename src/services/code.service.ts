import { setError } from '../helpers/shortcuts';
import { Context } from 'moleculer';

import { AppDataSource } from '../database/connection';

import { Code } from '../entities/Code';

module.exports = {
  name: 'codes',

  actions: {
    async getAll(ctx: Context) {
      try {
        const codeRepository = AppDataSource.getRepository(Code);
        const codes = await codeRepository.find({
          select: ['id', 'name'],
        });

        return {
          success: true,
          data: codes,
          count: codes.length,
        };
      } catch (error) {
        setError(ctx, 500);
        return {
          success: false,
          error: 'Failed to fetch codes',
          details: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },

  },

  started() {
    console.log('User Service started');
  },
};
