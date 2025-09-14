import { pool as db } from '../db.js';

class UserController {
    async createUser(req, res) {
        const { username, user_id, reffered_by } = req.body;

        const newUser =
            await db.query(`INSERT INTO person (id, username, coins, reffered_by) values ($1, $2, $3, $4) RETURNING *`, [user_id, username, 100, reffered_by || null]);

        res.json(newUser.rows[0])
    }

    async getUser(req, res) {
        const id = req.params.id;
        const users = await db.query(`SELECT * FROM person where id = $1`, [id]);

        res.json(users.rows[0]);
    }

    async getAllUsers(req, res) {
        const users = await db.query(`SELECT * FROM person ORDER BY coins DESC`);

        res.json(users.rows);
    }

    static async staticUpdateLastVisitedDate(userId) {
        const currentDate = new Date().toISOString();

        await db.query(`UPDATE person SET last_visited_date = NOW() AT TIME ZONE 'UTC' WHERE id = $1`, [userId]);
    }
}

export { UserController };
