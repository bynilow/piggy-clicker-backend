import { tgBot } from './tgBot.js';

const sendMessageToChat = async (userId, message) => {
    try {
        await tgBot.telegram.sendMessage(
            userId,
            message
        );
    } catch (err) {
        console.error("Ошибка при отправке:", err.message);
    }
}

export { sendMessageToChat };
