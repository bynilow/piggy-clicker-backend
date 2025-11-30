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

    //boost kits

    async getBoostsKits(req, res) {
        const user_id = req.headers['x-user-id'];

        const kits = await db.query(`SELECT * FROM boosts_kits WHERE user_id = $1`, [user_id]);

        res.json(kits.rows);
    }

    async addBoostsKits(req, res) {
        const user_id = req.headers['x-user-id'];
        const { kit_id, count } = req.body;

        const currentKit = await db.query(`SELECT * FROM boosts_kits WHERE user_id = $1 AND kit_id = $2`, [user_id, kit_id]);

        let newKit = null;

        if (currentKit.rows[0]) {
            newKit = await db.query(`
                UPDATE boosts_kits 
                SET count = count + ${count} 
                WHERE user_id = ${user_id} 
                AND kit_id = ${kit_id} 
                RETURNING *
            `);
        } else {
            newKit = await db.query(`
                INSERT INTO boosts_kits (user_id, kit_id, count) 
                VALUES (${user_id}, ${kit_id}, ${count}) 
                RETURNING *`
            );
        }

        res.json(newKit.rows[0]);
    };

    async openBoostSet(req, res) {
        const userId = req.headers['x-user-id'];

        const { boosts, cost } = req.body;

        const sortedBoostsByRare = {
            common: boosts.filter(boost => boost.boost_rare === 'common'),
            rare: boosts.filter(boost => boost.boost_rare === 'rare'),
            mythical: boosts.filter(boost => boost.boost_rare === 'mythical'),
            legendary: boosts.filter(boost => boost.boost_rare === 'legendary'),
        };

        const RARE_CHANCE = {
            common: 60, // 100 - 60 - 40%
            rare: 30, // 60 - 30 - 30%
            mythical: 10, // 30 - 10 - 20% 
            legendary: 0, // 10 - 0 - 10%
        };

        const winBoosts = [];

        while (winBoosts.length !== 6) {
            const randomNumber = Math.ceil(Math.random() * 100);

            let randomSelectedBoost = null;

            if (randomNumber >= RARE_CHANCE.common && sortedBoostsByRare.common.length > 0 && !randomSelectedBoost) {
                randomSelectedBoost = sortedBoostsByRare.common[Math.ceil(Math.random() * sortedBoostsByRare.common.length - 1)];
            };

            if (randomNumber >= RARE_CHANCE.rare && randomNumber < RARE_CHANCE.common && sortedBoostsByRare.rare.length > 0 && !randomSelectedBoost) {
                randomSelectedBoost = sortedBoostsByRare.rare[Math.ceil(Math.random() * sortedBoostsByRare.rare.length - 1)];
            };

            if (randomNumber >= RARE_CHANCE.mythical && randomNumber < RARE_CHANCE.rare && sortedBoostsByRare.mythical.length > 0 && !randomSelectedBoost) {
                randomSelectedBoost = sortedBoostsByRare.mythical[Math.ceil(Math.random() * sortedBoostsByRare.mythical.length - 1)];
            };

            if (randomNumber < RARE_CHANCE.mythical && sortedBoostsByRare.legendary.length > 0 && !randomSelectedBoost) {
                randomSelectedBoost = sortedBoostsByRare.legendary[Math.ceil(Math.random() * sortedBoostsByRare.legendary.length - 1)];
            };

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
