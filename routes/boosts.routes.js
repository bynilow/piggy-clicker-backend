import { Router } from "express";
import { BoostsController } from "../controller/boosts.controller.js";

const boostsRouter = new Router();

const boostsController = new BoostsController();

boostsRouter.put('/boosts/buy', boostsController.buyBoost);
boostsRouter.get('/boosts/:id', boostsController.getUserBoosts);
boostsRouter.post('/kits/', boostsController.getBoostsKits);
boostsRouter.post('/kits/open', boostsController.openBoostSet);
boostsRouter.post('/kits/add', boostsController.addBoostsKits);

export { boostsRouter };