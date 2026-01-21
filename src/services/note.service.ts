import { setError } from '../helpers/shortcuts';
import { AppDataSource } from '../database/connection';
import { Context } from 'moleculer';

import { Note } from '../entities/Note';

module.exports = {
  name: 'notes',

  actions: {
    async getAll(ctx: Context) {
      try {
        const noteRepository = AppDataSource.getRepository(Note);
        const notes = await noteRepository.find({
          select: ['id', 'title', 'content', 'createdAt', 'updatedAt'],
        });

        return {
          success: true,
          data: notes,
          count: notes.length,
        };
      } catch (error) {
        setError(ctx, 500);
        return {
          success: false,
          error: 'Failed to fetch notes',
          details: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },

    async getOne(ctx: Context) {
      try {
        const id = (ctx.params as { id: number }).id;

        if (Number.isNaN(Number(id))) {
          setError(ctx, 500);
          return {
            success: false,
            error: "Invalid input: 'notes id' must be numeric",
          };
        }

        const noteRepository = AppDataSource.getRepository(Note);
        const note = await noteRepository.findOneBy({ id });

        return {
          success: true,
          data: note,
        };
      } catch (error) {
        setError(ctx, 500);
        return {
          success: false,
          error: 'Failed to fetch notes',
          details: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },

    async insert(ctx: IContextMeta) {
      try {
        const length = Object.keys(ctx.params).length;
        const notes = Array.from({ ...ctx.params, length }) as Note[];

        if (!notes?.length) {
          setError(ctx, 400);
          return {
            success: false,
            error: "Invalid input: 'notes' must be an array",
          };
        }

        if (notes.length === 0) {
          setError(ctx, 400);
          return {
            success: false,
            error: "Invalid input: 'notes' array cannot be empty",
          };
        }

        for (const note of notes) {
          if (!note.title) {
            setError(ctx, 400);
            return {
              success: false,
              error: 'Invalid input: each note must have name and email',
            };
          }
        }

        const noteRepository = AppDataSource.getRepository(Note);
        const savedNotes = await noteRepository.save(notes);

        return {
          success: true,
          message: `Successfully created ${savedNotes.length} notes`,
          data: savedNotes.map((note: any) => ({
            id: note.id,
            name: note.title,
            email: note.content,
          })),
        };
      } catch (error) {
        setError(ctx, 500);
        return {
          success: false,
          error: 'Failed to create notes',
          details: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },

    async update(ctx: IContextMeta) {
      try {
        const { id, title, content } = ctx.params;

        const noteRepository = AppDataSource.getRepository(Note);
        const note = await noteRepository.findOneBy({ id });
        if (!note) {
          setError(ctx, 404);
          return {
            success: false,
            error: `Note with id ${id} not found`,
          };
        }

        note.title = title;
        note.content = content;
        note.updatedAt = new Date(); // Обновляем updatedAt при изменении записи

        await noteRepository.update(note.id, note);
        return note;
      } catch (error) {
        setError(ctx, 500);
        return {
          success: false,
          error: 'Failed to create notes',
          details: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },

    async delete(ctx: IContextMeta) {
      try {
        const idFrom = (ctx.params as { id: number }).id;
        const id = Number(idFrom);

        if (Number.isNaN(id)) {
          setError(ctx, 500);
          return {
            success: false,
            error: "Invalid input: 'note id' must be numeric",
          };
        }

        const noteRepository = AppDataSource.getRepository(Note);
        const note = await noteRepository.findOneBy({ id });
        if (!note) {
          setError(ctx, 404);
          return {
            success: false,
            error: `Note with id ${id} not found`,
          };
        }

        await noteRepository.remove(note);
        return { message: `Note with id ${id} deleted` };
      } catch (error) {
        setError(ctx, 500);
        return {
          success: false,
          error: 'Failed to create notes',
          details: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  },

  started() {
    console.log('Note Service started');
  },
};
