import express from 'express';
import { userRouter } from './routes/user.routes.js';

const PORT = 5000;

const app = express();

app.use(express.json());

app.use('/api', userRouter);

app.listen(PORT, () => console.log(`server starts on ${PORT} port`))