import express from 'express';
import { userRouter } from './routes/user.routes.js';
import { coinsRouter } from './routes/coins.routes.js';
import { boostsRouter } from './routes/boosts.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { UserController } from './controller/user.controller.js';
import { referralsRouter } from './routes/referrals.routes.js';

import { Telegraf } from 'telegraf';

// -------------------- EXPRESS --------------------

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
    console.log('User ID from header:', userId);

    if (!req.path.startsWith('/api/users') && userId) {
        UserController.staticUpdateLastVisitedDate(userId);
    }
    next();
    // setTimeout(next, 250);
});

app.use('/api', userRouter);
app.use('/api', coinsRouter);
app.use('/api', boostsRouter);
app.use('/api', referralsRouter);

app.listen(PORT, () => console.log(`server starts on ${PORT} port`));

// -------------------- TG --------------------

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;

if (!TG_BOT_TOKEN) {
    console.log("Токен бота не найден");
};

const tgBot = new Telegraf(TG_BOT_TOKEN);

tgBot.start(async (ctx) => {
    const payload = ctx.startPayload; // то, что приходит после ?start=

    await ctx.reply(
        "Добро пожаловать в Piggy Clicker 🐷!",
        {
            reply_markup: {
                keyboard: [
                    [
                        { text: "🚀 Открыть приложение", web_app: { url: `https://t.me/PiggyClickerBot/?startapp=${payload}` } }
                    ]
                ],
                resize_keyboard: true,
            },
        }
    );
});

// запуск бота (long polling)
tgBot.launch()
    .then(() => console.log("Бот запущен"))
    .catch((err) => console.error("Ошибка запуска бота:", err));