import { Router } from "express";
import { userController } from "../dependencies";

export const userRouter = Router();

userRouter.post('/login', userController.verifyUser.bind(userController));
