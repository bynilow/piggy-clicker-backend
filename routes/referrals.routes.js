import { Router } from "express";
import { ReferralController } from "../controller/referral.controller.js";

const referralsRouter = new Router();

const referralsController = new ReferralController();

referralsRouter.get('/referrals', referralsController.getReferrals);

export { referralsRouter };