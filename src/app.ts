import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { Routes } from './app/modules/routes';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

app.use('/api/users', Routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

export default app;
