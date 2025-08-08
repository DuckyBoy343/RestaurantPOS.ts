import knex from 'knex';
import path from 'path';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '../Restaurant.db')
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
