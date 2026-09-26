import { type Request, type Response } from 'express';
import app from './app.ts';

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});



app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});