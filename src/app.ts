import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/users/users.routes';
import { OrderRoute } from './app/modules/orders/orders.routes';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

app.use('/api/users', UserRoutes);
app.use('/api/users/:userId/orders', OrderRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

export default app;
