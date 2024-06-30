import log from "../utils/logger";
import { DESFIRE_INS, DESFIRE_STATUS } from "./DesfireConstants";
import DesfireUtils from "./utils/DesfireUtils";
import DesfireResponse from "./DesfireResponse";
import DesfireAuthentication from "./Auth/DesfireAuthentication";

class DesfireEV3 {
    private nfcManager: any;
    private appId: number[] = [0x00, 0x00, 0x00];
    private sessionKey: String = "";
    private sessionAuthMac: String = "";
    private sessionAuthEnc: String = "";

    authenticate = async (keyNumber: number, key: string) => {
        log.title("Authenticate");
        let isAuth = await DesfireAuthentication.authenticateLegacy(keyNumber, key);

        if (isAuth) {
            this.sessionKey = DesfireAuthentication.getSessionKey;
            log.title("Session Key: ", this.sessionKey);
        } else {
            log.error("Authentication Failed");
        }
    }
    
    format = async () => {
        log.title("Format");
        let cmd = DESFIRE_INS.FORMAT;
        let response = await DesfireResponse.sendCommand(cmd);

        let status = response.status;
        if (status === DESFIRE_STATUS.SUCCESS) {
            console.log("Format Successful");
        }
    }

    selectApplication = async (aid = [0x00, 0x00, 0x00]) => {
        let cmd = DESFIRE_INS.SELECT_APPLICATION;

        const response = await DesfireResponse.sendCommand(cmd, aid);
        const status = response.status;

        if (status === DESFIRE_STATUS.SUCCESS) {
            console.log("Application Successfully Selected with AID: ", aid);
        }
    }

    getUid = async () => {
        let cmd = DESFIRE_INS.GET_UID;
        let response = await DesfireResponse.sendCommand(cmd);
        log.info(response);

        cmd = DESFIRE_INS.ADDITIONAL_FRAME;

        response = await DesfireResponse.sendCommand(cmd);        
        response = await DesfireResponse.sendCommand(cmd);

        let cardUid = response.data.slice(0, 14);
        cardUid = ("0x").concat(cardUid);

        return cardUid;
    }
}

export default DesfireEV3;