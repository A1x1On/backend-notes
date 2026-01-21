import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { User } from '../entities/User';

export class AddSampleUsers1762763282846 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('users');

    if (tableExists) return;

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: true,
            default: null,
          },
        ],
      }),
    );

    await queryRunner.manager.getRepository(User).insert([
      { name: 'Doe2', email: 'john.doe@example.com', updatedAt: null },
      { name: 'Smith2', email: 'jane.smith@example.com', updatedAt: null },
      { name: 'Johnson2', email: 'bob.johnson@example.com', updatedAt: null },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .getRepository(User)
      .delete({ email: 'john.doe@example.com' });
    await queryRunner.manager
      .getRepository(User)
      .delete({ email: 'jane.smith@example.com' });
    await queryRunner.manager
      .getRepository(User)
      .delete({ email: 'bob.johnson@example.com' });
  }
}
