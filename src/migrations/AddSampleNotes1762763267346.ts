import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { Note } from '../entities/Note';

export class AddSampleNotes1762763267346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('notes');

    if (tableExists) return;

    await queryRunner.createTable(
      new Table({
        name: 'notes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'content',
            type: 'varchar',
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

    await queryRunner.manager.getRepository(Note).insert([
      {
        title: 'Рабочие задачи',
        content:
          'Задачи на сегодня: сделать ревью кода, провести встречу с командой, обновить документацию.',
        updatedAt: new Date('2025-11-10T10:30:00'),
      },
      {
        title: 'Важная информация',
        content:
          'Не забудьте проверить отчеты за прошедшую неделю, а также подготовить материалы для презентации.',
        updatedAt: new Date('2025-11-09T15:45:00'),
      },
      {
        title: 'Мои мысли',
        content:
          'Заметка для записей мыслей. Это место для того, чтобы оставить идеи и размышления.',
        updatedAt: null,
      },
      {
        title: 'Планы на завтра',
        content:
          'Завтра с утра проверить все серверы и подготовить отчет по задачам за неделю.',
        updatedAt: new Date('2025-11-10T09:00:00'),
      },
      {
        title: 'Вопросы по проекту',
        content:
          'Есть несколько вопросов по последнему релизу. Нужно уточнить технические детали у команды.',
        updatedAt: null,
      },
      {
        title: 'Идеи для улучшений',
        content:
          'Подумать, как улучшить производительность системы и ускорить процессы обработки данных.',
        updatedAt: new Date('2025-11-08T18:00:00'),
      },
      {
        title: 'Запрос на обучение',
        content:
          'Нужно пройти курс по безопасности данных. Запросить доступ и выбрать время для занятий.',
        updatedAt: new Date('2025-11-07T14:00:00'),
      },
      {
        title: 'Моменты для встречи',
        content:
          'Запланировать встречу с клиентом для обсуждения новых требований к продукту.',
        updatedAt: new Date('2025-11-06T11:00:00'),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .getRepository(Note)
      .delete({ title: 'Рабочие задачи' });

    await queryRunner.manager
      .getRepository(Note)
      .delete({ title: 'Важная информация' });

    await queryRunner.manager
      .getRepository(Note)
      .delete({ title: 'Мои мысли' });

    await queryRunner.manager
      .getRepository(Note)
      .delete({ title: 'Планы на завтра' });

    await queryRunner.manager
      .getRepository(Note)
      .delete({ title: 'Вопросы по проекту' });

    await queryRunner.manager
      .getRepository(Note)
      .delete({ title: 'Идеи для улучшений' });

    await queryRunner.manager
      .getRepository(Note)
      .delete({ title: 'Запрос на обучение' });

    await queryRunner.manager
      .getRepository(Note)
      .delete({ title: 'Моменты для встречи' });
  }
}
