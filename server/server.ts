import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
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

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
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

export { app };

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
