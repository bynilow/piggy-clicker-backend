import { Telegraf } from 'telegraf';

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;

if (!TG_BOT_TOKEN) {
    console.log("Токен бота не найден");
};

const tgBot = new Telegraf(TG_BOT_TOKEN);

tgBot.start(async (ctx) => {
    console.log('ctx payload: ', ctx.payload)
    const payload = ctx.payload;

    const appUrl = payload
        ? `https://t.me/PiggyClickerBot/game?startapp=${payload}`
        : `https://t.me/PiggyClickerBot/game`;

    try {
        await ctx.reply("Добро пожаловать в Piggy Clicker 🐷!", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Играть", web_app: { url: appUrl }, }]
                ],
                resize_keyboard: true,
            },
        });
    } catch (err) {
        if (err.response?.error_code === 403) {
            console.warn(`⚠️ Пользователь ${ctx.from.id} заблокировал бота`);
        } else {
            console.error("Ошибка при отправке сообщения:", err);
        }
    }
});

// запуск бота (long polling)
tgBot.launch()
    .then(() => console.log("Бот запущен"))
    .catch((err) => console.error("Ошибка запуска бота:", err));

export { tgBot };
