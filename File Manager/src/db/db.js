import * as db from './query.js'

export const createUserTableText = `
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(20) PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`
export const createFolderTableText = `
CREATE TABLE IF NOT EXISTS folders (
    Id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(20),
    folder TEXT NOT NULL,
    subfolder TEXT,
    file TEXT
  );
`
export const createMetadataTableText = `
CREATE TABLE IF NOT EXISTS meta (
    Id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fileName TEXT,
    size TEXT,
    uploadDate TEXT
  );
`
await db.query(createUserTableText);
await db.query(createFolderTableText);
await db.query(createMetadataTableText);
