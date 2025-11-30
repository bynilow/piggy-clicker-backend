import { pool as db } from '../db.js';

class AchievementController {
    async getAchievements(req, res) {
        const userId = req.headers['x-user-id'];

        const achievements = await db.query(`SELECT * FROM achievements WHERE user_id = $1`, [userId]);

        res.json(achievements.rows)
    }

    async addAchievement(req, res) {
        const user_id = req.headers['x-user-id'];
        const { achievement_id } = req.body;

        const currentAchievement =
            await db.query(`SELECT * FROM achievements WHERE user_id = $1 AND achievement_id = $2`, [user_id, achievement_id]);

        let newAchievement = null;

        if (currentAchievement.rows[0]) {
            newAchievement = await db.query(`UPDATE achievements SET achievement_level = achievement_level + 1 WHERE user_id = $1 AND achievement_id = $2 RETURNING *`, [user_id, achievement_id]);
        } else {
            newAchievement = await db.query(`INSERT INTO achievements (user_id, achievement_id, achievement_level) values ($1, $2, $3) RETURNING *`, [user_id, achievement_id, 1]);
        }

        res.json(newAchievement.rows[0])
    }
}

export { AchievementController };
