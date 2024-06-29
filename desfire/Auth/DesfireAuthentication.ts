import log from "../../utils/logger";
import { DESFIRE_INS } from "../DesfireConstants";
import DesfireResponse from "../DesfireResponse";
import DesfireUtils from "../utils/DesfireUtils";

class DesfireAuthentication {

    static authenticateAES = async (keyNumber: number, key: string) => {

    }
    
    static authenticateEV2First = async (keyNumber: number, key: string) => {
        let cmd = DESFIRE_INS.AUTH_EV2_FIRST;
        let keyNo = DesfireUtils.intToHexArrayLSB(keyNumber, 1);

        let _lenCap = [0x02];
        let _pcdCap = [0xC0, 0x00];

        let dataToSend = keyNo.concat(_lenCap).concat(_pcdCap);

        let response = await DesfireResponse.sendCommand(cmd, dataToSend);
        log.info(response);
    }
}

export default DesfireAuthentication