import { pool as db } from '../db.js';

class BoostsController {
    async buyBoost(req, res) {
        const { user_id, boost_id, boost_cost } = req.body;

        const currentUpgradedBoost = await db.query(`SELECT * FROM boosts WHERE user_id = $1`, [user_id]);

        let newBoost = null;

        if (currentUpgradedBoost.rows[0]) {
            newBoost = await db.query(`UPDATE boosts SET boost_level = boost_level + 1 where user_id = $1 AND boost_id = $2 RETURNING *`, [user_id, boost_id]);
        } else {
            newBoost = await db.query(`INSERT INTO boosts (boost_id, boost_level, user_id) values ($1, $2, $3) RETURNING *`, [boost_id, 1, user_id]);
        }

        await db.query(`UPDATE person SET coins = coins - $1 where id = $2`, [boost_cost, user_id]);

        res.json(newBoost.rows[0])
    }

    async getUserBoosts(req, res) {
        const id = req.params.id;

        const users = await db.query(`SELECT * FROM boosts where user_id = $1`, [id]);

        res.json(users.rows[0]);
    }
}

export { BoostsController };
