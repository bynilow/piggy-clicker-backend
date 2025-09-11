import express from 'express';
import { userRouter } from './routes/user.routes.js';
import { coinsRouter } from './routes/coins.routes.js';
import { boostsRouter } from './routes/boosts.routes.js';
import cors from 'cors';

const PORT = 8080;

const app = express();

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000', 'https://yourdomain.com'],
    credentials: true
}));

app.use('/api', userRouter);
app.use('/api', coinsRouter);
app.use('/api', boostsRouter);

app.listen(PORT, () => console.log(`server starts on ${PORT} port`))