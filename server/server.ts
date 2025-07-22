import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import productsRouter from './routes/products';
import categoryRouter from './routes/categories';
import rolesRouter from './routes/roles';
import tablesRouter from './routes/tables';
import usersRouter from './routes/users';

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
