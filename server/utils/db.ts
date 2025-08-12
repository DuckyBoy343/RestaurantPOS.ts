import knex from 'knex';

let dbInstance: any;

export function initializeDatabase(dbPath: string) {
  if (dbInstance) {
    return dbInstance;
  }

  console.log(`[DB] Initializing connection to: ${dbPath}`);
  
  const db = knex({
    client: 'sqlite3',
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn: any, done: (err: Error | null, conn: any) => void) => {
        conn.run('PRAGMA foreign_keys = ON', done);
      },
    },
  });

  dbInstance = db;
  return db;
}

export { dbInstance as db };