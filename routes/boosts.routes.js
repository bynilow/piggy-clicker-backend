import { Router } from "express";
import { BoostsController } from "../controller/boosts.controller.js";

const boostsRouter = new Router();

const boostsController = new BoostsController();

boostsRouter.put('/boosts/buy', boostsController.buyBoost);
boostsRouter.get('/boosts/:id', boostsController.getUserBoosts);
boostsRouter.post('/sets/buy', boostsController.buyBoostSet);

export { boostsRouter };