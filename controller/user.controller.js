import { pool as db } from '../db.js';
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

        const formattedUsername = username?.replace('@', '');

        if (!formattedUsername) {
            const users = await db.query(`SELECT * FROM person ORDER BY coins DESC`);

            res.json(users.rows);
        } else {
            const users = await db.query(`
                SELECT * 
                FROM person 
                WHERE username ILIKE $1
                ORDER BY coins DESC
                LIMIT 5
            `, [`%${formattedUsername}%`]);

            res.json(users.rows);
        }
    }

    async getLeaders(req, res) {
        const user_id = req.headers['x-user-id'];

        const allLeaders = await db.query(`SELECT * FROM person ORDER BY coins DESC LIMIT 30`);

        const allLeadersWithBoosts = [];

        for (const leader of allLeaders.rows) {
            const userBoosts = await db.query(`SELECT boost_id, boost_level FROM boosts WHERE user_id = $1`, [leader.id]);

            allLeadersWithBoosts.push({ ...leader, boosts: userBoosts.rows });
        }

        const currentUserPosition = await db.query(`
            SELECT COUNT(*) + 1 as position
            FROM person 
            WHERE coins > (SELECT coins FROM person WHERE id = $1);
        `, [user_id]);

        const result = {
            current_user_place: currentUserPosition.rows[0].position,
            leaders: allLeadersWithBoosts
        }

        res.json(result);
    }

    static async staticUpdateLastVisitedDate(userId) {
        const currentDate = new Date().toISOString();

        await db.query(`UPDATE person SET last_visited_date = NOW() AT TIME ZONE 'UTC' WHERE id = $1`, [userId]);
    }
}

export { UserController };
