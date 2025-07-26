import knex from 'knex';

const db = knex({
  client: 'mssql',
  connection: {
    host: process.env.DB_SERVER!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    options: {
      encrypt: false, // Use true if using Azure SQL
      trustServerCertificate: true, // Use true for local development
    },
  },
});

export default db;
