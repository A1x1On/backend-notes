# Notes backend Project

## Development server

1. Up database
2. Comment DB_HOST=db in .env
3. Run `npx ts-node --transpile-only src/index.ts` for a dev server. Navigate to `http://localhost:4005/notes` api

## Docker Server

1. Use DB_HOST=db in .env
2. Go to folder root
3. docker compose up --build -d
