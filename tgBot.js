import { Telegraf } from 'telegraf';

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;

if (!TG_BOT_TOKEN) {
    console.log("Токен бота не найден");
};

const tgBot = new Telegraf(TG_BOT_TOKEN);

tgBot.start(async (ctx) => {
    console.log(ctx)
    console.log('ctx payload: ', ctx.payload)
    const payload = ctx.payload;

    const appUrl = payload
        ? `https://piggy-clicker.vercel.app/?tgWebAppStartParam=${payload}`
        : `https://piggy-clicker.vercel.app/`;

    await ctx.reply(
        "Добро пожаловать в Piggy Clicker 🐷!",
        {
            reply_markup: {
                keyboard: [
                    [
                        { text: "🚀 Открыть приложение", web_app: { url: appUrl } }
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

export { tgBot };
