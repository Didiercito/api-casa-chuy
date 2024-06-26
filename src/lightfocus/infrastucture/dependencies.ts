import { LightFocusController } from "./controller/lightfocusController";
import { lightfocusMySQLAdapter } from "./adapters/lightfocusMySQLAdapter";
import { TurnOffUseCase, TurnOnUseCase, GetAllLightFocusUseCase} from "../application/use-case/lightfocusUseCase";

const lightfocusRepository = new lightfocusMySQLAdapter();
const turnOnUseCase = new TurnOnUseCase(lightfocusRepository);
const turnOffUseCase = new TurnOffUseCase(lightfocusRepository);
const getAllLightFocusUseCase = new GetAllLightFocusUseCase(lightfocusRepository);
export const lightFocusController = new LightFocusController(turnOnUseCase, turnOffUseCase, getAllLightFocusUseCase);