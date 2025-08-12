import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { initializeDatabase } from './utils/db';

dotenv.config();

import cors from 'cors';

import productsRouter from './routes/products.routes';
import categoryRouter from './routes/categories.routes';
import rolesRouter from './routes/roles.routes';
import tablesRouter from './routes/tables.routes';
import usersRouter from './routes/users.routes';
import ordersRouter from './routes/orders.routes';
import authRouter from './routes/auth.routes';
import inventoryRouter from './routes/inventory.route';
import { authenticateToken } from './middleware/auth.middleware';

const allowedOrigins = [
  'http://localhost:3000',
  'app-protocol://client'
];

function configureEnv(envPath: string) {
  dotenv.config({ path: envPath });
}

const app = express();
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/api/ping', (_, res) => {
  res.send('API running');
});

app.use('/api/auth', authRouter);

app.use('/api/products', authenticateToken, productsRouter);
app.use('/api/categories', authenticateToken, categoryRouter);
app.use('/api/roles', authenticateToken, rolesRouter);
app.use('/api/tables', authenticateToken, tablesRouter);
app.use('/api/users', authenticateToken, usersRouter);
app.use('/api/orders', authenticateToken, ordersRouter);
app.use('/api/inventory', authenticateToken, inventoryRouter);

export function startServer(dbPath: string, envPath: string) {
  configureEnv(envPath);
  initializeDatabase(dbPath);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`✅ API server started on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  console.log('[Dev Mode] Starting server...');
  const devDbPath = path.resolve(__dirname, '../Restaurant.db');
  const devEnvPath = path.resolve(__dirname, '../.env'); // .env is in the root
  startServer(devDbPath, devEnvPath);
}

export { app };
