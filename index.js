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
    console.log('Request origin:', req.headers.origin);
    console.log('Cookies header:', req.headers.cookie);
    console.log('Parsed cookies:', req.cookies);

    if (!req.path.startsWith('/api/users') && req.cookies && req.cookies.user_id !== 'undefined') {
        UserController.staticUpdateLastVisitedDate(req.cookies.user_id);
    }
    next();
    // setTimeout(next, 250);
});

app.use('/api', userRouter);
app.use('/api', coinsRouter);
app.use('/api', boostsRouter);

app.listen(PORT, () => console.log(`server starts on ${PORT} port`))