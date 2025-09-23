import { pool as db } from '../db.js';
import { sendMessageToChat } from '../bot/sendMessageToChat.js';

class CoinsController {
    async addCoins(req, res) {
        const { user_id, coins } = req.body;

        const user = await db.query(`UPDATE person SET coins = coins + $1 where id = $2 RETURNING coins`, [coins, user_id]);

        res.json(user.rows[0])
    }

    async sendCoins(req, res) {
        const user_id = req.headers['x-user-id'];
        const { send_to_id, coins } = req.body;

        console.log(user_id, send_to_id, coins)

        const senderCoins = await db.query(`UPDATE person SET coins = coins - $1 WHERE id = $2 RETURNING coins, username`, [coins, user_id]);
        await db.query(`UPDATE person SET coins = coins + $1 WHERE id = $2`, [coins, send_to_id]);

        await db.query(`INSERT INTO sending_history (sender_id, recipient_id, coins, datetime) values ($1, $2, $3, NOW())`, [user_id, send_to_id, coins]);

        sendMessageToChat(send_to_id, `💰 @${senderCoins.rows[0].username} отправил вам ${Number(coins).toFixed(0)} монеток!`);

        res.json(senderCoins.rows[0].coins)
    }

    async getSendingHistory(req, res) {
        const user_id = req.headers['x-user-id'];

        const history = await db.query(`
            SELECT 
                sh.*,
            CASE 
                WHEN sh.sender_id = $1 THEN p_recipient.avatar_url
                ELSE p_sender.avatar_url
            END as avatar_url,
            CASE 
                WHEN sh.sender_id = $1 THEN p_recipient.username
                ELSE p_sender.username
            END as username
            FROM sending_history sh
            LEFT JOIN person p_sender ON sh.sender_id = p_sender.id
            LEFT JOIN person p_recipient ON sh.recipient_id = p_recipient.id
            WHERE sh.sender_id = $1 OR sh.recipient_id = $1
            ORDER BY sh.datetime DESC
            LIMIT 30
        `, [user_id]);

        res.json(history.rows)
    }
}

export { CoinsController };
