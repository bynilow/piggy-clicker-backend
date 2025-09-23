import { Router } from "express";
import { UserController } from "../controller/user.controller.js";

const userRouter = new Router();

const userController = new UserController();

userRouter.post('/users/', userController.createUser);
userRouter.get('/users/:id', userController.getUser);
userRouter.get('/users/', userController.getAllUsers);
userRouter.get('/leaders', userController.getLeaders);

export { userRouter };