const sendMessageToChat = async (userId, message) => {
    try {
        await tgBot.telegram.sendMessage(
            userId,
            message
        );
    } catch (err) {
        console.error("Ошибка при отправке сообщения рефереру:", err.message);
    }
}

export { sendMessageToChat };
