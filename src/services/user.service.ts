import { setError } from '../helpers/shortcuts';
import { AppDataSource } from '../database/connection';

import { User } from '../entities/User';

module.exports = {
  name: 'users',

  actions: {
    async getUsers(ctx: IContextMeta) {
      try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find({
          select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
        });

        return {
          success: true,
          data: users,
          count: users.length,
        };
      } catch (error) {
        setError(ctx, 500);
        return {
          success: false,
          error: 'Failed to fetch users',
          details: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },

    async createUsers(ctx: IContextMeta) {
      try {
        const length = Object.keys(ctx.params).length;
        const users = Array.from({ ...ctx.params, length }) as User[];

        if (!users?.length) {
          setError(ctx, 400);
          return {
            success: false,
            error: "Invalid input: 'users' must be an array",
          };
        }

        if (users.length === 0) {
          setError(ctx, 400);
          return {
            success: false,
            error: "Invalid input: 'users' array cannot be empty",
          };
        }

        for (const user of users) {
          if (!user.name || !user.email) {
            setError(ctx, 400);
            return {
              error: 'Invalid input: each user must have name and email',
            };
          }
        }

        const userRepository = AppDataSource.getRepository(User);
        const savedUsers = await userRepository.save(users);

        return {
          success: true,
          message: `Successfully created ${savedUsers.length} users`,
          data: savedUsers.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
          })),
        };
      } catch (error) {
        setError(ctx, 500);
        return {
          success: false,
          error: 'Failed to create users',
          details: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  },

  started() {
    console.log('User Service started');
  },
};
