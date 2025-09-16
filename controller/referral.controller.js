import { pool as db } from '../db.js';

class ReferralController {
    async getReferrals(req, res) {
        const userId = req.headers['x-user-id'];

        const referrals = await db.query(`SELECT id, username, avatar_url FROM person WHERE referred_by = $1`, [userId]);

        const referralsBoosts = [];

        for (const referral of referrals.rows) {
            const referralBoosts = await db.query(`SELECT boost_id, boost_level FROM boosts WHERE user_id = $1`, [referral.id]);

            referralsBoosts.push({
                user_id: referral.id,
                username: referral.username,
                avatar_url: referral.avatar_url,
                boosts: referralBoosts.rows,
            });
        }

        res.json(referralsBoosts)
    }
}

export { ReferralController };
