import knex from 'knex';
import path from 'path';

const isDev = process.env.NODE_ENV !== 'production';

let dbPath: string;

if (isDev) {
  // Only go up ONE level from 'utils' to the 'server' folder
  dbPath = path.resolve(__dirname, '../Restaurant.db');
} else {
  const { app } = require('electron');
  dbPath = path.join(app.getPath('userData'), 'Restaurant.db');
}

console.log(`[DB] Connecting to database at: ${dbPath}`);

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
  pool: {
    min: 1,
    max: 3,
    afterCreate: (conn: any, done: any) => {
      conn.run('PRAGMA foreign_keys = ON');
      conn.run('PRAGMA journal_mode = WAL');
      conn.run('PRAGMA synchronous = NORMAL');
      conn.run('PRAGMA busy_timeout = 5000');
      done();
    },
  },
});

export default db;