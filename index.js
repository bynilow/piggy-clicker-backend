import express from 'express';
import { userRouter } from './routes/user.routes.js';
import { coinsRouter } from './routes/coins.routes.js';
import { boostsRouter } from './routes/boosts.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { UserController } from './controller/user.controller.js';
import bodyParser from 'body-parser';

const PORT = 8080;

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(cookieParser());
app.use((req, res, next) => {
    res.cookie('user_id', req.cookies.user_id, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 дней
    });
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async function (req, res, next) {
    console.log('Cookies header:', req.headers.cookie);
    console.log('Parsed cookies:', req.cookies);

    if (!req.path.startsWith('/api/users') && req.cookies) {
        UserController.staticUpdateLastVisitedDate(req.cookies.user_id);
    }
    next();
    // setTimeout(next, 250);
});

app.use('/api', userRouter);
app.use('/api', coinsRouter);
app.use('/api', boostsRouter);

app.listen(PORT, () => console.log(`server starts on ${PORT} port`))