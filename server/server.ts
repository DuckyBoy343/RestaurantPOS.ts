import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (_, res) => {
  res.send('API running');
});

app.use('/api/products', productsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
