import { Router } from "express";
import { CoinsController } from "../controller/coins.controller.js";

const coinsRouter = new Router();

const coinsController = new CoinsController();

coinsRouter.put('/coins/add', coinsController.addCoins);
coinsRouter.put('/coins/send', coinsController.sendCoins);

export { coinsRouter };