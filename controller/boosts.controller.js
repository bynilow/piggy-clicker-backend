import { pool as db } from '../db.js';

class BoostsController {
    async buyBoost(req, res) {
        const { user_id, boost_id, boost_cost } = req.body;

        const currentUpgradedBoost = await db.query(`SELECT * FROM boosts WHERE user_id = $1 AND boost_id = $2`, [user_id, boost_id]);

        let newBoost = null;

        if (currentUpgradedBoost.rows[0]) {
            newBoost = await db.query(`UPDATE boosts SET boost_level = boost_level + 1 where user_id = $1 AND boost_id = $2 RETURNING *`, [user_id, boost_id]);
        } else {
            newBoost = await db.query(`INSERT INTO boosts (boost_id, boost_level, user_id) values ($1, $2, $3) RETURNING *`, [boost_id, 1, user_id]);
        }

        await db.query(`UPDATE person SET coins = coins - $1 where id = $2`, [boost_cost, user_id]);

        res.json({ ...newBoost.rows[0], boost_cost })
    }

    async getUserBoosts(req, res) {
        const id = req.params.id;

        const users = await db.query(`SELECT * FROM boosts where user_id = $1`, [id]);

        res.json(users.rows);
    }

    async buyBoostSet(req, res) {
        const userId = req.headers['x-user-id'];

        const { boosts, cost } = req.body;

        await db.query(`UPDATE person SET coins = coins - $1 where id = $2`, [cost, userId]);

        const sortedBoostsByRare = {
            common: boosts.filter(boost => boost.boost_rare === 'common'),
            rare: boosts.filter(boost => boost.boost_rare === 'rare'),
            mythical: boosts.filter(boost => boost.boost_rare === 'mythical'),
            legendary: boosts.filter(boost => boost.boost_rare === 'legendary'),
        };

        const RARE_CHANCE = {
            common: 60,
            rare: 25,
            mythical: 10,
            legendary: 5,
        };

        const winBoosts = [];

        while (winBoosts.length !== 6) {
            const randomNumber = Math.ceil(Math.random() * 100);

            let randomSelectedBoost = null;

            if (randomNumber <= RARE_CHANCE.legendary && sortedBoostsByRare.legendary.length > 0 && !randomSelectedBoost) {
                randomSelectedBoost = sortedBoostsByRare.legendary[Math.ceil(Math.random() * sortedBoostsByRare.legendary.length - 1)];
            }

            if (randomNumber <= RARE_CHANCE.mythical && sortedBoostsByRare.mythical.length > 0 && !randomSelectedBoost) {
                randomSelectedBoost = sortedBoostsByRare.mythical[Math.ceil(Math.random() * sortedBoostsByRare.mythical.length - 1)];
            }

            if (randomNumber <= RARE_CHANCE.rare && sortedBoostsByRare.rare.length > 0 && !randomSelectedBoost) {
                randomSelectedBoost = sortedBoostsByRare.rare[Math.ceil(Math.random() * sortedBoostsByRare.rare.length - 1)];
            }

            if (sortedBoostsByRare.common.length > 0 && !randomSelectedBoost) {
                randomSelectedBoost = sortedBoostsByRare.common[Math.ceil(Math.random() * sortedBoostsByRare.common.length - 1)];
            }

            if (randomSelectedBoost) {
                winBoosts.push(randomSelectedBoost);

                await db.query(`UPDATE boosts SET boost_level = boost_level + 1 where user_id = $1 AND boost_id = $2`,
                    [userId, randomSelectedBoost.boost_id]);
            }
        }

        res.json({ boosts_id: winBoosts.map(boost => boost.boost_id) });
    }
}

export { BoostsController };
