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

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (_, res) => {
  res.send('API running');
});

app.use('/api/products', productsRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/tables', tablesRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
