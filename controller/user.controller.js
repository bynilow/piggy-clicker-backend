import { pool as db } from '../db.js';

class UserController {
    async createUser(req, res) {
        const { username, id } = req.body;

        const newUser = await db.query(`INSERT INTO person (id, username, coins) values ($1, $2, $3) RETURNING *`, [id, username, 0]);

        res.json(newUser.rows[0])
    }

    async getUser(req, res) {
        const id = req.params.id;
        const users = await db.query(`SELECT * FROM person where id = $1`, [id]);

        await db.query(`UPDATE person SET lastUpdateDate = $1 where id = $2`, [new Date().toISOString(), id]);

        res.json(users.rows[0]);
    }

    async getAllUsers(req, res) {
        const users = await db.query(`SELECT * FROM person`);

        res.json(users.rows);
    }

    async addCoins(req, res) {
        const { id, coins } = req.body;

        const user = await db.query(`UPDATE person SET coins = $1 where id = $2 RETURNING coins`, [coins, id]);

        await db.query(`UPDATE person SET lastUpdateDate = $1 where id = $2`, [new Date().toISOString(), id]);

        res.json(user.rows[0])
    }
}

export { UserController };
