import { LightFocusController } from "./controller/lightfocusController";
import { LightfocusMySQLAdapter } from "./adapters/lightfocusMySQLAdapter";
import { TurnOffUseCase, TurnOnUseCase, GetLightFocusHistoryUseCase} from "../application/use-case/lightfocusUseCase";

const lightfocusRepository = new LightfocusMySQLAdapter();
const turnOnUseCase = new TurnOnUseCase(lightfocusRepository , (data: any) => console.log(data));
const turnOffUseCase = new TurnOffUseCase(lightfocusRepository, (data: any) => console.log(data));
const getAllLightFocusUseCase = new GetLightFocusHistoryUseCase(lightfocusRepository);
export const lightFocusController = new LightFocusController(turnOnUseCase, turnOffUseCase, getAllLightFocusUseCase);