import { Router } from "express";
import { AchievementController } from "../controller/achievement.controller.js";

const achievementRouter = new Router();

const achievementController = new AchievementController();

achievementRouter.get('/achievements', achievementController.getAchievements);
achievementRouter.put('/achievements/add', achievementController.addAchievement);

export { achievementRouter };