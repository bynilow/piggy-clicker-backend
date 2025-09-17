import { pool as db } from '../db.js';
import { tgBot } from '../bot/tgBot.js';
import { sendMessageToChat } from '../bot/sendMessageToChat.js';

class UserController {
    async createUser(req, res) {
        const { username, user_id, referred_by, avatar_url } = req.body;

        const newUser =
            await db.query(`INSERT INTO person (id, username, coins, referred_by, avatar_url) values ($1, $2, $3, $4, $5) RETURNING *`,
                [user_id, username, 1500, referred_by || null, avatar_url || null]);

        if (referred_by) {
            if (username) {
                sendMessageToChat(referred_by, `🎉 По вашей ссылке зарегистрировался новый пользователь: @${username}`);
            } else {
                sendMessageToChat(referred_by, `🎉 По вашей ссылке зарегистрировался новый пользователь!`);
            }
        }

        res.json(newUser.rows[0])
    }

    async getUser(req, res) {
        const id = req.params.id;
        const users = await db.query(`SELECT * FROM person where id = $1`, [id]);

        res.json(users.rows[0]);
    }

    async getAllUsers(req, res) {
        const username = req.query.username;
        console.log(username)
        if (!username) {
            const users = await db.query(`SELECT * FROM person ORDER BY coins DESC`);

            res.json(users.rows);
        } else {
            const users = await db.query(`
                SELECT * 
                FROM person 
                WHERE username LIKE $1
                ORDER BY coins DESC
                LIMIT 3
            `, [`%${username}%`]);

            res.json(users.rows);
        }
    }

    static async staticUpdateLastVisitedDate(userId) {
        const currentDate = new Date().toISOString();

        await db.query(`UPDATE person SET last_visited_date = NOW() AT TIME ZONE 'UTC' WHERE id = $1`, [userId]);
    }
}

export { UserController };
