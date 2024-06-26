import { userMySQLAdapter } from "./adapters/userMySQLAdapter";
import { UserLoginUseCase } from "../application/use-case/user-useCase";
import { UserController } from "./controller/userController";

const userRepository = new userMySQLAdapter();
const userUseCase = new UserLoginUseCase(userRepository);
export const userController = new UserController(userUseCase);

