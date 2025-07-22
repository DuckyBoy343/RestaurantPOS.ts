import sql from 'mssql';

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const poolPromise: Promise<sql.ConnectionPool> = new sql.ConnectionPool(config)
  .connect()
  .then((pool: sql.ConnectionPool) => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch((err: Error) => {
    console.error('Database Connection Failed!', err);
    throw err;
  });
