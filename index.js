import express from 'express';
import { userRouter } from './routes/user.routes.js';
import { coinsRouter } from './routes/coins.routes.js';
import { boostsRouter } from './routes/boosts.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { UserController } from './controller/user.controller.js';
import { referralsRouter } from './routes/referrals.routes.js';
import { tgBot } from './bot/tgBot.js';
import { achievementRouter } from './routes/achievement.routes.js';

const PORT = 8080;

const app = express();

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://piggy-clicker.vercel.app',
    ],
    credentials: true,
}));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async function (req, res, next) {
    const userId = req.headers['x-user-id'];

    if (!req.path.startsWith('/api/users') && userId) {
        UserController.staticUpdateLastVisitedDate(userId);
    }

    // setTimeout(next, 850);
    next();
});

app.use('/api', userRouter);
app.use('/api', coinsRouter);
app.use('/api', boostsRouter);
app.use('/api', referralsRouter);
app.use('/api', achievementRouter);

app.listen(PORT, () => console.log(`server starts on ${PORT} port`));