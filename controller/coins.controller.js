import { pool as db } from '../db.js';

class CoinsController {
    async addCoins(req, res) {
        const { user_id, coins } = req.body;

        const user = await db.query(`UPDATE person SET coins = coins + $1 where id = $2 RETURNING coins`, [coins, user_id]);

        res.json(user.rows[0])
    }

    async sendCoins(req, res) {
        const { send_to_id, coins, user_id } = req.body;

        const senderCoins = await db.query(`UPDATE person SET coins = coins - $1 WHERE id = $2 RETURNING coins`, [coins, user_id]);

        await db.query(`UPDATE person SET coins = coins + $1 WHERE id = $2`, [coins, send_to_id]);

        res.json(senderCoins.rows[0])
    }
}

export { CoinsController };
